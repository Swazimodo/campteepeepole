#!/usr/bin/env bash
# Builds the Lambda layer, uploads the service source and deploys the app stack.
# Needs the bootstrap stack (infra/bootstrap.yaml) deployed once by an admin first.
set -euo pipefail
cd "$(dirname "$0")"

APP_STACK="${APP_STACK:-campteepeepole}"
BOOTSTRAP_STACK="${BOOTSTRAP_STACK:-campteepeepole-bootstrap}"
LAYER_DIR=services/gallery_thumbnail/layer

step() { printf '\n==> %s\n' "$1"; }
ok() { printf '    OK: %s\n' "$1"; }
fail() { printf '\n    ERROR: %s\n' "$1" >&2; [ -n "${2:-}" ] && printf '    Fix: %s\n' "$2" >&2; exit 1; }
trap 'fail "Deploy stopped at the step above." "Read the message above, fix it, then run this script again. It is safe to rerun."' ERR

step "Checking required tools"
command -v aws >/dev/null || fail "The AWS CLI is not installed." \
  "Install it from https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html, open a new terminal, then rerun."
ok "$(aws --version)"
venv_python=.venv/bin/python
[ -x "$venv_python" ] || venv_python=.venv/Scripts/python.exe
[ -x "$venv_python" ] || fail "The Python virtual environment is missing." "Run 'bash init.sh' first."
ok "Python venv"

step "Checking AWS sign-in"
account="$(aws sts get-caller-identity --query Account --output text 2>/dev/null)" || fail "You are not signed in to AWS." \
  "Run 'aws configure' or 'aws sso login', then rerun."
region="$(aws configure get region || true)"
[ -n "$region" ] || fail "No AWS region is set." "Run 'aws configure set region <region>', for example us-west-2."
ok "account $account, region $region"

step "Reading the bootstrap stack ($BOOTSTRAP_STACK)"
bootstrap_output() {
  aws cloudformation describe-stacks --stack-name "$BOOTSTRAP_STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text
}
artifact_bucket="$(bootstrap_output ArtifactBucketName 2>/dev/null)" || fail "The bootstrap stack was not found in $region." \
  "An admin must deploy infra/bootstrap.yaml once. See README.md, step 1."
exec_role="$(bootstrap_output CfnExecutionRoleArn)"
ok "artifact bucket $artifact_bucket"

parameters=()
if ! aws cloudformation describe-stacks --stack-name "$APP_STACK" >/dev/null 2>&1; then
  step "First deploy: GitHub access token needed"
  echo "    Amplify uses a GitHub personal access token once to connect the repo. It is not stored."
  echo "    Create one at https://github.com/settings/tokens with access to this repo."
  token="${GITHUB_TOKEN:-}"
  [ -n "$token" ] || read -rsp "    Paste the token and press Enter: " token
  echo
  [ -n "$token" ] || fail "No token entered." "Rerun and paste the token, or set GITHUB_TOKEN."
  parameters=(--parameter-overrides "GitHubAccessToken=$token")
fi

step "Building the Pillow layer for Lambda"
rm -rf "$LAYER_DIR"
"$venv_python" -m pip install --quiet --disable-pip-version-check \
  -r services/gallery_thumbnail/requirements.txt --target "$LAYER_DIR/python" \
  --platform manylinux2014_x86_64 --platform manylinux_2_28_x86_64 --only-binary=:all: --python-version 3.13
ok "$LAYER_DIR"

step "Uploading service source to s3://$artifact_bucket"
aws cloudformation package \
  --template-file infra/app.yaml \
  --s3-bucket "$artifact_bucket" \
  --output-template-file infra/app.packaged.yaml >/dev/null
ok "infra/app.packaged.yaml"

step "Deploying stack $APP_STACK (this can take several minutes)"
aws cloudformation deploy \
  --template-file infra/app.packaged.yaml \
  --stack-name "$APP_STACK" \
  --role-arn "$exec_role" \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset \
  ${parameters[@]+"${parameters[@]}"}

step "Starting a site build in Amplify"
build_function="$(aws cloudformation describe-stacks --stack-name "$APP_STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteBuildFunctionName'].OutputValue" --output text)"
invoke_result="$(mktemp)"
function_error="$(aws lambda invoke --function-name "$build_function" --query FunctionError --output text "$invoke_result")"
payload="$(cat "$invoke_result")"
rm -f "$invoke_result"
[ "$function_error" = "None" ] || fail "The build trigger failed: $payload" \
  "Check the $build_function logs in CloudWatch, or start a build from the Amplify console."
ok "build requested (skipped if one is already waiting); follow it in the Amplify console"

trap - ERR
step "Deploy complete"
aws cloudformation describe-stacks --stack-name "$APP_STACK" \
  --query "Stacks[0].Outputs[].[OutputKey,OutputValue]" --output table
