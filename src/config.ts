export const serviceDiscoveryNamespace = 'cito';

const getAuthEnvConfig = (): any => {
  const authEnvConfig: any = {};

  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      authEnvConfig.userPoolId = 'eu-central-1_HYLD4MoTL';
      authEnvConfig.userPoolWebClientId = '496tv5tk13ofnb7brg7t6r90kn';
      break;
    case 'test':
      authEnvConfig.userPoolId = 'eu-central-1_htA4V0E1g';
      authEnvConfig.userPoolWebClientId = '2ccv0hpd4mq0rir7fs4qi7ah5l';
      break;
    case 'production':
      authEnvConfig.userPoolId = 'eu-central-1_fttc090sQ';
      authEnvConfig.userPoolWebClientId = '4v72uodmi74apj2dobpd8jsr8k';
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
      oAuthEnvConfig.domain =
        'auth-dev-citodata.auth.eu-central-1.amazoncognito.com';
      oAuthEnvConfig.redirectSignIn = 'http://localhost:3006';
      oAuthEnvConfig.redirectSignOut = 'http://localhost:3006';
      break;
    case 'test':
      oAuthEnvConfig.domain = 'auth-staging.citodata.com';
      oAuthEnvConfig.redirectSignIn = 'https://www.app-staging.citodata.com';
      oAuthEnvConfig.redirectSignOut = 'https://www.app-staging.citodata.com';
      break;
    case 'production':
      oAuthEnvConfig.domain = 'auth.citodata.com';
      oAuthEnvConfig.redirectSignIn = 'https://www.app.citodata.com';
      oAuthEnvConfig.redirectSignOut = 'https://www.app.citodata.com';
      break;
    default:
      break;
  }

  return oAuthEnvConfig;
};

export const oAuthEnvConfig = getOAuthEnvConfig();

interface SlackConfig {slackClientId: string, slackClientSecret:string}; 

const getSlackConfig = (): SlackConfig  => {
  const slackConfig : any = {};

  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      slackConfig.slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID_DEV || '';
      slackConfig.slackClientSecret = process.env.REACT_APP_SLACK_CLIENT_SECRET_DEV || '';
      break;
    case 'test':
      slackConfig.slackClientId = '';
      slackConfig.slackClientSecret = '';
      break;
    case 'production':
      slackConfig.slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID || '';
      slackConfig.slackClientSecret = process.env.REACT_APP_SLACK_CLIENT_SECRET || '';
      break;
    default:
      throw new Error('app stage not found');
  }

  return slackConfig;
};

export const slackConfig = getSlackConfig();
