# Development environment setup

Windows install steps using chocolatey. After every cli tool install, you will likely need to reopen the shell so that it loads the new path variables.
1. Install chocolaty  
    https://chocolatey.org/install

1. Install git cli  
    https://community.chocolatey.org/packages/git.install  
    `choco install git.install`

1. Install nvm  
    https://community.chocolatey.org/packages/nvm  
    `choco install nvm`

1. Install node v20  
    `nvm install lts`  
    `nvm use [installed_lts_version]`  
    `node --version`
1. Install yarn globally  
    `npm install --global yarn`

# Repo directory

## Routing: src\app\\*
This application uses next.js app routing. The `app` folder contains the pages which can be routed to. The directory structure defines the routes in the website.
https://nextjs.org/docs/app/building-your-application/routing

```--app
|--blog
|--|--page.js
|--|--post
|--|--|--page.js
```
**Note:** You can skip the `page.js` in the `app/blog` directory if you do not need that endpoint. In this case, Next.js will render a 404 page.

Dynamic routes are still defined by the directory structure but you can use square brackets in the folder name to indicate it is a dynamic param `[slug]`.

```--app
|--page.js
|--[slug]
|--|--page.js
```

```export default function Page({params}){
  return (
    <div>My slug is: {params.slug}</div>
  )
}
```

## Components: src\components\\*
next.js allows server side execution but all the components in this directory are for the client. This is indicated by `'use client';` in `src\components\index.ts`.