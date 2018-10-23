const DEFAULT_PROFILE_NAME = 'default';
const DEFAULT_MFA_NAME     = 'mfa';


class Profiles{
  constructor(){
    let   currentValue = null;
    const cliArguments = process.argv.reduce( (accumulator,current) => {
      if(current.startsWith('--')) {
        currentValue = current.replace('--','');
      } else if(currentValue) {
        accumulator[currentValue] = current;
        currentValue = null;
      }
      return accumulator;
    },{});

    this.profile = cliArguments['profile'];
  }

  getAWSProfileName(){
    return this.profile || DEFAULT_PROFILE_NAME;
  }

  getMFAProfileName(){
    return `${this.getAWSProfileName()}-${DEFAULT_MFA_NAME}`;
  }
}

module.exports = Profiles