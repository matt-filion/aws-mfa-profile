'use strict';

const Prompts     = require('./prompts');
const AWSSTS      = require('./aws-sts');
const Credentials = require('./credentials');

const credentials = new Credentials();
const prompts     = new Prompts();
const awssts      = new AWSSTS();


prompts.start()
  .then( () => credentials.init() )
  .then( () => !credentials.getDevice() ? prompts.askForDevice() : credentials.getDevice() )
  .then( deviceSerialNumber => credentials.setDevice(deviceSerialNumber) )
  .then( () => prompts.askForToken() )
  .then( token => awssts.getSession(credentials.getDevice(),token) )
  .then( session => credentials.setSession(session) )
  .then( () => credentials.save() )
  .then( () => {
    console.log('To use your session, use the profile mfa via --profile mfa')
    prompts.close();
  })
  .catch( error => {
    console.error(error);
    prompts.close();
  })



