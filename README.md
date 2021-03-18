# node-windows-cli

![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@vandorensales/node-windows-cli?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/min/@vandorensales/node-windows-cli?style=flat-square)

This package is an unofficial CLI wrapper around the [node-windows](https://www.npmjs.com/package/node-windows) package. We aim to simplify the installation of node applications as Windows services in environments where you are installing multiple applications on a regular basis.

## Overview

Currently supported features in node-windows-cli

- **Service Install**: Fresh installation of services
- **Service Uninstall**: Easy uninstall of services
- **Service Reinstall**: One command to uninstall and reinstall a service (primarily used when you make configuration changes)
- **Admin Verification**: Makes sure you are installing from an elevated terminal. We've ran in to issues before when we didn't run from an elevated state.

## Installation

This tool can either be installed globaly

`npm install -g node-windows-cli`

or on a project by project basis

`npm install --save-dev node-windows-cli`

If installed locally, you will need to add additional scripts to your `package.json` that use this package's commands

## Setting up and installing your Windows service

In the root of your project directory, create a `.servicerc.json` file with the following schema.

```json
{
  "service": {
    "name": "Service Name",
    "description": "Service Description",
    "script": "C:\\Path\\To\\Your\\Script\\Directory"
  }
}
```

Currently, we only support an absolute path to your script. In the future we would like to add a way to automatically get the script path.

## Using environment variables

Create a `.env` file in the root of your project directory.`. Any variables in this file will be parsed and added to the service.

```js
SERVICE_EXAMPLE = 'Example env variable';
SERVICE_EXAMPLE2 = 1337;
```

## Using the CLI

After setting up your `.servicerc.json` and `.env` files, you can use the following commands to manage your service.

- `nw --install` will install your application as a service
- `nw --uninstall` will uninstall your application's service
- `nw --reinstall` will uninstall and reinstall your application as a service
