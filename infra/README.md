# Infrastructure

Two CloudFormation stacks. Deploy steps are in the [root README](../README.md#infrastructure).

## Bootstrap stack (`bootstrap.yaml`)

Deployed once per account by an admin. It holds the roles and bucket that app deploys use.

```mermaid
flowchart LR
  subgraph callers[Deployers]
    gha[GitHub Actions<br/>repo + master branch]
    dev[deploy.sh<br/>signed-in user]
  end

  subgraph bootstrap[campteepeepole-bootstrap]
    oidc[GitHubOidcProvider<br/>token.actions.githubusercontent.com]
    deployRole[GitHubDeployRole]
    execRole[CfnExecutionRole]
    artifacts[(ArtifactBucket<br/>private)]
  end

  cfn[CloudFormation<br/>CampTemplate stack]

  gha -- OIDC token --> oidc
  oidc -- AssumeRoleWithWebIdentity --> deployRole
  deployRole -- package uploads --> artifacts
  dev -- package uploads --> artifacts
  deployRole -->|deploy with role-arn| cfn
  dev -->|deploy with role-arn| cfn
  deployRole -. iam:PassRole .-> execRole
  cfn -- assumes --> execRole
  cfn -- reads Lambda code --> artifacts
```

## App stack (`app.yaml`)

```mermaid
flowchart LR
  maintainer([Maintainer])
  visitor([Visitor])
  github[(GitHub repo<br/>master)]
  deployer([deploy.sh /<br/>GitHub Actions])

  subgraph app[CampTemplate]
    subgraph content[Content]
      contentBucket[(ContentBucket<br/>private, versioned)]
    end

    subgraph gallery[Gallery]
      ingest[(GalleryIngestBucket<br/>private)]
      uploadedRule{{GalleryUploadedRule<br/>Object Created}}
      thumbFn[GalleryThumbnailFunction<br/>+ PillowLayer]
      live[(GalleryLiveBucket<br/>public object read)]
    end

    subgraph trigger[Build trigger with debounce]
      changedRule{{SiteChangedRule<br/>Object Created / Deleted}}
      queue[[BuildQueue<br/>SQS]]
      buildFn[SiteBuildFunction]
    end

    subgraph hosting[Amplify Hosting]
      amplify[AmplifyApp + AmplifyBranch<br/>s3 sync MDX, yarn build, deploy out/]
      serviceRole[AmplifyServiceRole<br/>read content, list gallery]
    end
  end

  maintainer -- MDX CRUD --> contentBucket
  maintainer -- add photos --> ingest
  maintainer -- delete photos --> live
  ingest --> uploadedRule --> thumbFn
  thumbFn -- image + thumb_ --> live

  contentBucket --> changedRule
  live --> changedRule
  changedRule --> queue --> buildFn
  deployer -- invoke after deploy --> buildFn
  buildFn -- ListJobs / StartJob RELEASE --> amplify
  github -- push webhook --> amplify

  amplify -. build runs as .-> serviceRole
  serviceRole -. GetObject .-> contentBucket
  serviceRole -. ListBucket .-> live

  visitor -- HTTPS pages --> amplify
  visitor -- HTTPS images --> live
```

Each Lambda has its own role (`SiteBuildRole`, `GalleryThumbnailRole`) and its own log group, which keeps logs for 90 days.

Maintainers use `MaintainerRole`, not the deploy roles. It can:

| Bucket | Can do |
| --- | --- |
| `ContentBucket` | List, and read, write and delete `*.mdx` files. |
| `GalleryIngestBucket` | List and write files. |
| `GalleryLiveBucket` | List and delete files. |
