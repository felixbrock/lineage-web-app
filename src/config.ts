export const serviceDiscoveryNamespace = 'cito';

const getAuthEnvConfig = (): any => {
  const authEnvConfig: any = {};

  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      authEnvConfig.userPoolId = 'eu-central-1_7Y1FT2rcP';
      authEnvConfig.userPoolWebClientId = '38ikjjvjc46uanhgnqqm6i93nb';
      break;
    // case 'test':
    //   authEnvConfig.userPoolId = 'eu-central-1_ITfib17Uu';
    //   authEnvConfig.userPoolWebClientId = '4uat3ul6agn2dsipki1kvifq0b';
    //   break;
    case 'production':
      authEnvConfig.userPoolId = 'eu-central-1_NTf5yG8C1';
      authEnvConfig.userPoolWebClientId = '2a6q1v6s81dbsi3ms373mt5kdc';
      break;
    default:
      break;
  }

  return authEnvConfig;
};

export const authEnvConfig = getAuthEnvConfig();

const getOAuthEnvConfig = (): any => {
  const oAuthEnvConfig: any = {};

  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      oAuthEnvConfig.domain = 'citodata.auth.eu-central-1.amazoncognito.com';
      oAuthEnvConfig.redirectSignIn = 'http://localhost:3006/';
      oAuthEnvConfig.redirectSignOut = 'http://localhost:3006/';
      break;
    // case 'test':
    //   oAuthEnvConfig.domain = 'auth-test.hivedive.io';
    //   oAuthEnvConfig.redirectSignIn = 'https://app-test.hivedive.io';
    //   oAuthEnvConfig.redirectSignOut = 'https://app-test.hivedive.io';
    //   break;
    case 'production':
      oAuthEnvConfig.domain = 'auth.citodata.com';
      oAuthEnvConfig.redirectSignIn = 'https://app.citodata.com/';
      oAuthEnvConfig.redirectSignOut = 'https://citodata.com/';
      break;
    default:
      break;
  }

  return oAuthEnvConfig;
};

export const oAuthEnvConfig = getOAuthEnvConfig();
