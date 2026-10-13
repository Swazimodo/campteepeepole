# AWS account setup

How to set up your camp's AWS so that the site runs in its own account, and people sign in with
IAM Identity Center instead of the root user. Do this once, before you deploy the
[bootstrap stack](README.md#bootstrap-stack-bootstrapyaml) from your copy of this template repo.

```
Management account        AWS Organizations, IAM Identity Center, billing. No workloads.
└── Camp account          bootstrap stack + CampTemplate stack
```

| Who | Signs in with | Uses |
| --- | --- | --- |
| Admin | Identity Center, `AdministratorAccess` permission set | Deploys the bootstrap stack and runs `deploy.sh` |
| Maintainer | Identity Center, `Maintainer` permission set | Assumes `MaintainerRole` from the app stack |
| GitHub Actions | OIDC | `GitHubDeployRole` from the bootstrap stack |

## Before you start

- You need the root user sign-in for the account you have now. This account becomes the management account.
- You need an email address for the camp account that is not used by another AWS account. Use a
  group address that more than one person can read, not a personal address.
  ([Use a group email address](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html#ru-bp-group))
- If your account is on the free tier, creating an organization moves it to the paid plan and ends
  your free tier credits.
  ([Enable IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/get-set-up-for-idc.html))

## 1. Secure the root user

1. Sign in as the root user.
2. Register at least one MFA device for the root user. Register two if you can, so you can still
   sign in if you lose one.
   ([Root user MFA](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html#ru-bp-mfa))
3. Delete any root user access keys.
   ([Don't create access keys for the root user](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html#ru-bp-access))
4. After step 3 of this guide, use the root user only for
   [tasks that require it](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#root-user-tasks).

## 2. Create the organization

1. Open the [AWS Organizations console](https://console.aws.amazon.com/organizations/v2) and choose
   **Create an organization**. Keep **all features** turned on.
2. Verify the email address if AWS asks you to.

Your current account is now the management account. Do not deploy the camp stacks into it.
Service control policies do not apply to the management account, and keeping workloads out makes
the bills easier to read.

- [Creating an organization](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_org_create.html)
- [Best practices for the management account](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_best-practices_mgmt-acct.html)

## 3. Turn on IAM Identity Center and create your admin user

1. Open the [IAM Identity Center console](https://console.aws.amazon.com/singlesignon) in the Region
   you deploy the camps to, and choose **Enable**. Choose the organization instance.
   You can't move Identity Center to a different Region later without deleting it.
2. Add a user for yourself, and a group called `Admins`. Choose **Send an email to this user with
   password setup instructions**.
3. Create a permission set from the predefined `AdministratorAccess` policy.
4. Assign the `Admins` group with `AdministratorAccess` to the management account.
5. Accept the invitation email, set your password and register an MFA device.
6. Make sure **Prompt users for MFA** is set to **Every time they sign in**.
7. Sign out of the root user. From now on, sign in through the AWS access portal URL in the
   invitation email.

- [Enable IAM Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/get-set-up-for-idc.html)
- [Configure user access with the default directory](https://docs.aws.amazon.com/singlesignon/latest/userguide/get-started-assign-account-access-admin-user.html)
- [Prompt users for MFA](https://docs.aws.amazon.com/singlesignon/latest/userguide/mfa-getting-started.html)

## 4. Create the camp account

1. In the AWS Organizations console, choose **Add an AWS account**, then **Create an AWS account**.
2. Enter the camp name and the camp account's email address. Keep the default role name
   `OrganizationAccountAccessRole`.
3. Assign the `Admins` group with `AdministratorAccess` to the new account
   (IAM Identity Center > **AWS accounts**).

New member accounts have no root user password. To manage the camp account's root access from the
management account, turn on centralized root access.

- [Creating a member account](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts_create.html)
- [Assign user or group access to AWS accounts](https://docs.aws.amazon.com/singlesignon/latest/userguide/assignusers.html)
- [Centrally manage root access for member accounts](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user-access-management)

## 5. Create the Maintainer permission set

Maintainers get only one permission from Identity Center: they can assume `MaintainerRole`.
`MaintainerRole` is in the app stack and has the bucket permissions.

1. In IAM Identity Center, create a **Custom permission set** called `Maintainer`.
2. Add this inline policy, and no other policies:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "sts:AssumeRole",
         "Resource": "arn:aws:iam::*:role/CampTemplate-MaintainerRole-*"
       }
     ]
   }
   ```

3. Create a group called `Maintainers`.
4. Assign the `Maintainers` group with `Maintainer` to the camp account.

- [Create a permission set](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtocreatepermissionset.html)
- [Add users to your Identity Center directory](https://docs.aws.amazon.com/singlesignon/latest/userguide/addusers.html)

## 6. Deploy into the camp account

1. Set up a CLI profile for the camp account with `aws configure sso`. Choose the camp account and
   `AdministratorAccess`, and name the profile `camp-admin`.
   ([Configure IAM Identity Center authentication with the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html))
2. Deploy the bootstrap stack. Set `GitHubRepo` and `GitHubBranch` to your copy of the template
   repo and the branch that deploys the site:

   ```bash
   aws sso login --profile camp-admin
   aws cloudformation deploy --profile camp-admin \
     --template-file infra/bootstrap.yaml \
     --stack-name campteepeepole-bootstrap \
     --capabilities CAPABILITY_IAM \
     --parameter-overrides GitHubRepo=<owner>/<repo> GitHubBranch=master
   ```

3. Deploy the app:

   ```bash
   AWS_PROFILE=camp-admin bash deploy.sh
   ```

4. Copy `MaintainerRoleArn` and the bucket names from the stack outputs and give them to the
   maintainers.

## 7. Set up a maintainer

1. Add the user in IAM Identity Center and put them in the `Maintainers` group.
2. The maintainer accepts the invitation email, sets a password and registers MFA.
3. The maintainer runs `aws configure sso`, chooses the camp account and `Maintainer`, and names
   the profile `camp-sso`.
4. The maintainer adds a second profile to `~/.aws/config` that assumes `MaintainerRole`:

   ```ini
   [profile maintainer]
   source_profile = camp-sso
   role_arn = <MaintainerRoleArn>
   ```

5. The maintainer signs in once with `aws sso login --profile camp-sso`. After that, they add
   `--profile maintainer` to every command, as shown in the
   [root README](../README.md#3-give-maintainers-access).

- [Using an IAM role in the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-role.html)

## If the stacks are already in the management account

CloudFormation can't move a stack to a different account. Deploy into the camp account first,
copy the MDX files and gallery photos to the new buckets, check the new site, and then delete the
old stacks. The buckets have `DeletionPolicy: Retain`, so delete them yourself after the copy.

## Further reading

- [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Root user best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)
