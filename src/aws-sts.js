'use strict';

const AWS = require('aws-sdk');

class AWSSTS {
  constructor(){
    this.sts = new AWS.STS()
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