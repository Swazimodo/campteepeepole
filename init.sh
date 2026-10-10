#!/usr/bin/env bash
# Sets up local development: pyenv Python, the repo .venv and the site's node_modules.
set -euo pipefail
cd "$(dirname "$0")"

step() { printf '\n==> %s\n' "$1"; }
ok() { printf '    OK: %s\n' "$1"; }
fail() { printf '\n    ERROR: %s\n' "$1" >&2; [ -n "${2:-}" ] && printf '    Fix: %s\n' "$2" >&2; exit 1; }
trap 'fail "Setup stopped at the step above." "Read the message above, fix it, then run this script again. It is safe to rerun."' ERR

python_version="$(cat .python-version)"
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

step "Checking required tools"
command -v pyenv >/dev/null || fail "pyenv is not installed." \
  "Install it from https://github.com/pyenv/pyenv (Windows: https://github.com/pyenv-win/pyenv-win), open a new terminal, then rerun."
ok "pyenv $(pyenv --version | awk '{print $2}')"
command -v node >/dev/null || fail "Node.js is not installed." \
  "Install the LTS version from https://nodejs.org, open a new terminal, then rerun."
ok "Node.js $(node --version)"

step "Installing Python $python_version (skipped if already installed)"
pyenv install --skip-existing "$python_version"
ok "Python $python_version"

step "Creating the Python virtual environment in .venv"
if [ -d .venv ]; then ok ".venv already exists"; else python -m venv .venv; ok "created .venv"; fi
venv_python=.venv/bin/python
[ -x "$venv_python" ] || venv_python=.venv/Scripts/python.exe

step "Installing Python packages into .venv"
"$venv_python" -m pip install --quiet --disable-pip-version-check -r services/gallery_thumbnail/requirements.txt
ok "services/gallery_thumbnail/requirements.txt"

step "Setting up Yarn"
if ! command -v corepack >/dev/null; then
  echo "    Corepack is missing (Node.js 25+ no longer includes it). Installing it with npm..."
  npm install --global corepack || fail "Could not install Corepack." \
    "Run 'npm install --global corepack' yourself (it may need an administrator terminal), then rerun."
fi
corepack enable || fail "Could not enable Corepack." \
  "Open the terminal as administrator, run 'corepack enable', then rerun."
ok "Yarn $(cd site && yarn --version)"

step "Installing website packages (this can take a few minutes)"
(cd site && yarn install)
ok "site/node_modules"

trap - ERR
printf '\nSetup complete.\n'
printf 'Before working on the Python services, activate the venv:\n'
printf '    source .venv/bin/activate      (Windows: .venv\\Scripts\\activate)\n'
printf 'To run the website: cd site && yarn dev, then open http://localhost:3000\n'
