#!/usr/bin/env node
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const NW = require('node-windows');
const admin = require('admin-check');

const servicercSchema = require('./models/servicerc');
const argsSchema = require('./models/args');

admin.check().then((isAdmin) => {
  if (!isAdmin) {
    console.error('This script requires admin privileges');
    process.exit(1);
  }

  const dir = process.cwd();
  const servicercFilePath = path.resolve(dir, '.servicerc.json');
  const args = minimist(process.argv.slice(2));
  let servicercData = {};

  const argsValidate = argsSchema.validate(args);
  if (argsValidate.error != null) {
    console.error(argsValidate.error);
    process.exit(1);
  }

  // Add environment variables to process
  const env = dotenv.config({ path: path.resolve(dir, '.env.service') });

  // Map variables to the format node-windows expects
  const environment = Object.keys(env).map((key) => ({
    name: key,
    value: env[key],
  }));

  // Check to see if we are in a "root" directory. (Assuming if package.json is available, that we are in a root directory)
  try {
    fs.accessSync(path.resolve(dir, 'package.json'));
  } catch (err) {
    console.error(err);
    console.info('This command must be run in a root directory.');
    process.exit(1);
  }

  // Read and parse the .servicerc.json file
  try {
    fs.accessSync(servicercFilePath);
    servicercData = JSON.parse(fs.readFileSync(servicercFilePath, 'utf8'));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  servicercData = servicercSchema.validate(servicercData);

  if (servicercData.error != null) {
    console.error(servicercData.error);
    process.exit(1);
  }

  servicercData = servicercData.value;

  // Create a new Windows service based on the provided information from the .servicerc.json file and environment variables
  const svc = new NW.Service({
    name: servicercData.service.name,
    description: servicercData.service.description,
    script: servicercData.service.script,
    env: [
      {
        name: 'NODE_ENV',
        value: 'production',
      },
      ...environment,
    ],
  });

  // Runs when service has been started
  svc.on('start', function () {
    console.log('Service started!');
    process.exit(0);
  });

  // Runs when service has finished installing
  svc.on('install', function () {
    console.log('Service installed! Starting service...');
    svc.start();
  });

  // Runs when an error occurs during installation
  svc.on('error', function (err) {
    console.log(`Service error: ${err.message}`);
    process.exit(1);
  });

  // Runs when the service is already installed
  svc.on('alreadyinstalled', function () {
    console.log('Service already installed.');

    if (!args.reinstall) {
      process.exit(0);
    }

    console.log('Uninstalling service...');

    svc.uninstall();
  });

  // Runs when the service is finished uninstalling
  // Reinstalls the service with new environment variables
  svc.on('uninstall', function () {
    console.log('Service uninstalled.');

    if (args.reinstall) {
      console.log('Reinstalling service...');
      svc.install();
    }

    process.exit(0);
  });

  if (args.install || args.reinstall) {
    // Start install of service
    svc.install();
  }

  if (args.uninstall) {
    // Start uninstall of service
    svc.uninstall();
  }
});
