# Camp Teepee Pole

Monorepo for the camp website and its AWS infrastructure.

| Folder | Contents |
| --- | --- |
| [site/](site/) | Next.js static site. Run `yarn` commands from this folder. |
| [services/](services/) | Python Lambda functions, one folder each. |
| [infra/](infra/) | CloudFormation templates. |

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup.

## Site

```bash
cd site
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Services

`.python-version` pins the Lambda runtime version for [pyenv](https://github.com/pyenv/pyenv) (or [pyenv-win](https://github.com/pyenv-win/pyenv-win)).
Install packages into the repo's `.venv`, never globally.

[init.sh](init.sh) installs that Python, creates `.venv` with the service requirements, and installs the site packages.
On Windows, run it from Git Bash.

```bash
bash init.sh
source .venv/bin/activate    # Windows: .venv\Scripts\activate

python services/site_build/test_handler.py
python services/gallery_thumbnail/test_handler.py
```

## Infrastructure

### 1. Bootstrap the account (once, as an admin)

Creates the GitHub Actions deploy role, the CloudFormation execution role and the artifact bucket.

```bash
aws cloudformation deploy \
  --template-file infra/bootstrap.yaml \
  --stack-name campteepeepole-bootstrap \
  --capabilities CAPABILITY_IAM
```

The app deploy reads the role ARN and the bucket name from this stack's outputs.

### 2. Deploy the application

[deploy.sh](deploy.sh) builds the Pillow layer, uploads the service source to the artifact bucket and
deploys the `campteepeepole` stack. On the first deploy it asks for a GitHub personal access token,
which Amplify uses once to connect the repo.

```bash
bash init.sh     # once
bash deploy.sh
```
