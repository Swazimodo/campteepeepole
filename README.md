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

The site deploys into its own AWS account. To set up the account and sign-in, see
[infra/ACCOUNT_SETUP.md](infra/ACCOUNT_SETUP.md).

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
deploys the `CampTemplate` stack. On the first deploy it asks for a GitHub personal access token,
which Amplify uses once to connect the repo.

```bash
bash init.sh     # once
bash deploy.sh
```

### 3. Give maintainers access

Maintainers do not use the deploy roles. The app stack creates `MaintainerRole`, which any user in the
account can assume if an admin allows it. It can edit the MDX files in the content bucket, add photos to
the gallery ingest bucket and delete photos from the live gallery bucket.

To let a user assume it, allow `sts:AssumeRole` on the role ARN in the user's own policy. The role ARN and
bucket names are in the app stack outputs. The role has no console list permissions, so maintainers use
the AWS CLI, for example:

```bash
aws s3 cp index.mdx "s3://<ContentBucketName>/about/index.mdx" --profile maintainer
aws s3 cp photo.jpg "s3://<GalleryIngestBucketName>/photo.jpg" --profile maintainer
aws s3 rm "s3://<GalleryLiveBucketName>/photo.jpg" --profile maintainer
aws s3 rm "s3://<GalleryLiveBucketName>/thumb_photo.jpg" --profile maintainer
```
