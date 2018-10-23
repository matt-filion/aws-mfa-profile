'use strict';

const AWS = require('aws-sdk');

class AWSSTS {
  constructor(){
  }

  init(credentials){
    const authority = credentials.getAWSAuthority();
    this.sts = new AWS.STS({
      accessKeyId: authority['aws_access_key_id'],
      secretAccessKey: authority['aws_secret_access_key']
    });
  }

  getSession(deviceSerialNumber,token){
    return this.sts.getSessionToken({
        SerialNumber: deviceSerialNumber,
        TokenCode:    token
      })
      .promise()
      .then( response => response.Credentials )
      .catch( error => error.message )
  }

}

module.exports = AWSSTS