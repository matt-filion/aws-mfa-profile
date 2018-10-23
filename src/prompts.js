'use strict';

const ARN_REGEX         = /(arn:aws:iam::)([a-zA-Z0-9-_]){12}(:mfa\/)([a-zA-Z0-9-_]).*/g
const readline          = require('readline');
const prompt            = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Prompts{

  constructor(){
  }

  start(){
    console.log("Starting...");
    return Promise.resolve();
  }

  close(){
    prompt.close();
  }

  askForToken() {
    return new Promise( (resolve,reject) => {
      /*
       * TODO
       * - Check to many attempts
       */
      const handle_token_input = (input) =>{
        if(!input || input.trim().length !== 6) {
          prompt.question(`${input} is not a valid token, it must be 6 digits no spaces.\n>`,handle_token_input);
        } else {
          resolve(input);
        }
      }
      
      prompt.question('What is your current mfa token?\n>', handle_token_input);
    });
  }

  askForDevice() {
    return new Promise( (resolve,reject) => {
      /*
       * TODO
       * - Check to many attempts
       */

      const handle_arn_input = (input) => {
        if(!ARN_REGEX.test(input)) {
          prompt.question(`${input} is not a correct ARN, arn:aws:iam::111111111111:mfa\\user is the format expected.\n>`,handle_arn_input);
        } else {
          resolve(input);
        }
      }

      prompt.question('What is your MFA device ID? It should be in the format arn:aws:iam::ACCOUNT_ID:mfa/USERNAME.\n>', handle_arn_input);
    })
  }
}

module.exports = Prompts