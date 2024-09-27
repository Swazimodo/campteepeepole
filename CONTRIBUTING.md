# Update site content
TODO: content/configuration docs

# Modify site template

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

