'use strict';

const Prompts     = require('./prompts');
const AWSSTS      = require('./aws-sts');
const Credentials = require('./credentials');
const Profiles    = require('./profiles');

const profiles    = new Profiles();
const credentials = new Credentials(profiles);
const prompts     = new Prompts(profiles);
const awssts      = new AWSSTS();

prompts.start()
  .then( () => credentials.init() )
  .then( () => awssts.init(credentials) )
  .then( () => !credentials.getDevice() ? prompts.askForDevice() : credentials.getDevice() )
  .then( deviceSerialNumber => credentials.setDevice(deviceSerialNumber) )
  .then( () => prompts.askForToken() )
  .then( token => awssts.getSession(credentials.getDevice(),token) )
  .then( session => credentials.setSession(session) )
  .then( () => credentials.save() )
  .then( () => {
    console.log(`To use your session, use the profile mfa via --profile ${profiles.getMFAProfileName()} (serverles is --aws-profile ${profiles.getMFAProfileName()})`)
    prompts.close();
  })
  .catch( error => {
    console.error(error);
    prompts.close();
  })
