export const serviceDiscoveryNamespace = 'cito';

const getAuthEnvConfig = (): any => {
  const authEnvConfig: any = {};

  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      authEnvConfig.userPoolId = 'todo';
      authEnvConfig.userPoolWebClientId = 'todo';
      break;
    case 'test':
      authEnvConfig.userPoolId = 'eu-central-1_X27xCNSof';
      authEnvConfig.userPoolWebClientId = 'lh7qnvrevedkem43b7qvpjhl';
      break;
    case 'production':
      authEnvConfig.userPoolId = 'todo';
      authEnvConfig.userPoolWebClientId = 'todo';
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
    case 'test':
      oAuthEnvConfig.domain = 'auth-staging.citodata.com';
      oAuthEnvConfig.redirectSignIn = 'https://app-staging.citodata.com';
      oAuthEnvConfig.redirectSignOut = 'https://app-staging.citodata.com';
      break;
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
