export const serviceDiscoveryNamespace = 'cito';

export const mode = process.env.REACT_APP_STAGE;

const getAuthEnvConfig = (): any => {
  const authEnvConfig: any = {};

  switch (mode) {
      case 'development':
        authEnvConfig.userPoolId = 'eu-central-1_0Z8JhFj8z';
        authEnvConfig.userPoolWebClientId = '2kt5cdpsbfc53sokgii4l5lecc';
        authEnvConfig.tokenUrl =
          '';
        break;
      case 'staging':
        authEnvConfig.userPoolId = 'eu-central-1_wiylubU1I';
        authEnvConfig.userPoolWebClientId = '3eut2m87s81e1k5tk277j5eg13';
        authEnvConfig.tokenUrl = '';
        break;
      case 'production':
        authEnvConfig.userPoolId = 'eu-central-1_0muGtKMk3';
        authEnvConfig.userPoolWebClientId = '90hkfejkd81bp3ta5gd80hanp';
        authEnvConfig.tokenUrl = '';
        break;
      default:
        break;
  }

  return authEnvConfig;
};

export const authEnvConfig = getAuthEnvConfig();

const getOAuthEnvConfig = (): any => {
  const oAuthEnvConfig: any = {};

  switch (mode) {
    case 'development':
      oAuthEnvConfig.domain =
        'auth-cito-dev.auth.eu-central-1.amazoncognito.com';
      oAuthEnvConfig.redirectSignIn = 'http://localhost:3006';
      oAuthEnvConfig.redirectSignOut = 'http://localhost:3006';
      break;
    case 'staging':
      oAuthEnvConfig.domain = 'auth-cito-staging.auth.eu-central-1.amazoncognito.com';
      oAuthEnvConfig.redirectSignIn = 'https://www.demo-environment.d3pbv3guh4fc7o.amplifyapp.com';
      oAuthEnvConfig.redirectSignOut = 'https://www.demo-environment.d3pbv3guh4fc7o.amplifyapp.com';
      break;
    case 'production':
      oAuthEnvConfig.domain = 'auth.citodata.com';
      oAuthEnvConfig.redirectSignIn = 'https://app.citodata.com';
      oAuthEnvConfig.redirectSignOut = 'https://app.citodata.com';
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


  switch (mode) {
    case 'development':
      slackConfig.slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID_DEV || '';
      slackConfig.slackClientSecret = process.env.REACT_APP_SLACK_CLIENT_SECRET_DEV || '';
      break;
    case 'staging':
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

interface GithubConfig {githubClientId: string, githubClientSecret:string}; 

const getGithubConfig = (): GithubConfig  => {
  const githubConfig : any = {};

  switch (mode) {
    case 'development':
      githubConfig.githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
      githubConfig.githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET || '';
      break;
    case 'staging':
      githubConfig.githubClientId = '';
      githubConfig.githubClientSecret = '';
      break;
    case 'production':
      githubConfig.githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID || '';
      githubConfig.githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET || '';
      break;
    default:
      throw new Error('app stage not found');
  }

  return githubConfig;
};

export const githubConfig = getGithubConfig();
