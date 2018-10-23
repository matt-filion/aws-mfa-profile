'use strict';

const fs              = require('fs');
const path            = require('path');
const os              = require('os');
const readline        = require('readline')
const CREDENTIAL_PATH = '.aws/credentials'

class Credentials {

  constructor(profiles){
    this.credentialsPath = path.join(os.homedir(),CREDENTIAL_PATH);
    this.mfaProfileName  = profiles.getMFAProfileName();
    this.profileName     = profiles.getAWSProfileName();
    this.credentials     = {};
  }

  /**
   * Build out the file structure from the file contents. Each 
   * key will be a section, indicated by the [asdf] in the file.
   * Each key value pair will be name value attributes of the
   * section.
   * [asdf]
   * foo=bar
   * 
   * Will be modeled as 
   * {
   *   'asdf':{
   *     'foo':'bar'
   *   }
   * }
   */
  init(){
    
    /**
     * Default credentials must exist before we attempt to get a session via MFA.
     */
    if(!fs.existsSync(this.credentialsPath)){
      throw "You must first run 'aws configure' and use an access key and secret key of an account that can create MFA credentials.";
    }

    let section = null;

    this.credentials = Buffer.from(fs.readFileSync(this.credentialsPath,'utf-8')).toString('utf-8').split(/(?:\r\n|\r|\n)/g)
      .reduce( (credentials,currentLine) => {
        
        if(!currentLine || currentLine.trim() == '') {
          //Toss out empty lines.  

        } else if(currentLine.trim().startsWith('[')){
          section = currentLine.trim().replace('[','').replace(']','');
          credentials[section] = {}

        } else if(section && currentLine.indexOf('=') !== -1){
          const lineParts = currentLine.split('=');
          credentials[section][lineParts[0].trim()] = lineParts[1].trim();

        }
        
        return credentials;

      },{})

    return Promise.resolve();
  }

  getAWSAuthority(){
    return this.credentials[this.profileName];
  }

  getDevice(){
    if(this.credentials[this.mfaProfileName]) return this.credentials[this.mfaProfileName]['serial_number'];
    return null;
  }
  
  setDevice(deviceSerialNumber){
    if(!this.credentials[this.mfaProfileName]) this.credentials[this.mfaProfileName] = {};
    this.credentials[this.mfaProfileName]['serial_number'] = deviceSerialNumber;
  }

  setSession(session){

    this.credentials[this.mfaProfileName]['aws_access_key_id']     = session.AccessKeyId;
    this.credentials[this.mfaProfileName]['aws_secret_access_key'] = session.SecretAccessKey;
    this.credentials[this.mfaProfileName]['aws_session_token']     = session.SessionToken;
    this.credentials[this.mfaProfileName]['expiration']            = session.Expiration.toISOString();

    return Promise.resolve();
  }

  save(){
    return new Promise( (resolve,reject) => {
      let body = '';
      
      for (const key in this.credentials) {
        body += `[${key.trim()}]\n`;

        for(const childKey in this.credentials[key]) {
          body += `${childKey} = ${this.credentials[key][childKey]}\n`;
        }

        body += '\n\n';

      }
      
      fs.writeFile(this.credentialsPath,body,(error) => error ? reject(error) : resolve() );
    });
  }

}

module.exports = Credentials