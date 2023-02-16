const getMode = (): string => {
  const mode = process.env.REACT_APP_STAGE;

  if (!mode) throw new Error('Config error - Mode missing');

  return mode;
};

interface UserPoolConfig {
  userPoolId: string;
  userPoolWebClientId: string;
  tokenUrl: string;
}

const getUserPoolConfig = (): UserPoolConfig => {
  let userPoolId: string, userPoolWebClientId: string, tokenUrl: string;
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      userPoolId = 'eu-central-1_0Z8JhFj8z';
      userPoolWebClientId = '2kt5cdpsbfc53sokgii4l5lecc';
      tokenUrl = '';
      break;
    case 'demo':
      userPoolId = 'eu-central-1_pyZJ42OJ6';
      userPoolWebClientId = '5o7prc8mt4nuqtlbatofpv9f5';
      tokenUrl = '';
      break;
    case 'production':
      userPoolId = 'eu-central-1_0muGtKMk3';
      userPoolWebClientId = '90hkfejkd81bp3ta5gd80hanp';
      tokenUrl = '';
      break;
    default:
      throw new Error('Unexpected mode');
  }

  return { userPoolId, userPoolWebClientId, tokenUrl };
};

interface OAuthEnvConfig {
  domain: string;
  redirectSignIn: string;
  redirectSignOut: string;
}

const getOAuthEnvConfig = (): OAuthEnvConfig => {
  let domain: string, redirectSignIn: string, redirectSignOut: string;
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      domain = 'auth-cito-dev.auth.eu-central-1.amazoncognito.com';
      redirectSignIn = 'http://localhost:3006';
      redirectSignOut = 'http://localhost:3006';
      break;
    case 'demo':
      domain = 'auth-cito-demo.auth.eu-central-1.amazoncognito.com';
      redirectSignIn = 'https://demo-environment.d3pbv3guh4fc7o.amplifyapp.com';
      redirectSignOut =
        'https://demo-environment.d3pbv3guh4fc7o.amplifyapp.com';
      break;
    case 'production':
      domain = 'auth.citodata.com';
      redirectSignIn = 'https://www.app.citodata.com';
      redirectSignOut = 'https://www.app.citodata.com';
      break;
    default:
      throw new Error('Unexpected mode');
  }

  return { domain, redirectSignIn, redirectSignOut };
};

interface SlackConfig {
  slackClientId: string;
  slackClientSecret: string;
}

const getSlackConfig = (): SlackConfig => {
  let slackClientId: string | undefined, slackClientSecret: string | undefined;
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID_DEV;
      slackClientSecret = process.env.REACT_APP_SLACK_CLIENT_SECRET_DEV;
      break;
    case 'demo':
      slackClientId = 'xxx';
      slackClientSecret = 'xxx';
      break;
    case 'production':
      slackClientId = process.env.REACT_APP_SLACK_CLIENT_ID;
      slackClientSecret = process.env.REACT_APP_SLACK_CLIENT_SECRET;
      break;
    default:
      throw new Error('Unexpected mode');
  }

  if (!slackClientId || !slackClientSecret)
    throw new Error('Missing Slack config');

  return { slackClientId, slackClientSecret };
};

interface BaseUrlConfig {
  accountService: string;
  observabilityService: string;
  integrationService: string;
  lineageService: string;
}

const getBaseUrlConfig = (): BaseUrlConfig => {
  let accountService: string | undefined,
    observabilityService: string | undefined,
    integrationService: string | undefined,
    lineageService: string | undefined;
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      accountService = process.env.REACT_APP_BASE_URL_ACCOUNT_DEV;
      observabilityService =
        process.env.REACT_APP_BASE_URL_DATA_OBSERVABILITY_DEV;
      integrationService =
        process.env.REACT_APP_BASE_URL_INTEGRATION_SERVICE_DEV;
      lineageService = process.env.REACT_APP_BASE_URL_LINEAGE_ANALYSIS_DEV;
      break;
    case 'demo':
      accountService = 'xxx';
      observabilityService = 'xxx';
      integrationService = 'xxx';
      lineageService = 'xxx';
      break;
    case 'production':
      accountService = process.env.REACT_APP_BASE_URL_ACCOUNT;
      observabilityService = process.env.REACT_APP_BASE_URL_DATA_OBSERVABILITY;
      integrationService = process.env.REACT_APP_BASE_URL_INTEGRATION_SERVICE;
      lineageService = process.env.REACT_APP_BASE_URL_LINEAGE_ANALYSIS;
      break;
    default:
      throw new Error('Unexpected mode');
  }

  if (
    !accountService ||
    !observabilityService ||
    !integrationService ||
    !lineageService
  )
    throw new Error('Missing base url config');

  return {
    accountService,
    observabilityService,
    integrationService,
    lineageService,
  };
};

const appConfig = {
  react: {
    mode: getMode(),
    showRealData: !process.env.REACT_APP_SHOW_REAL_DATA
      ? true
      : process.env.REACT_APP_SHOW_REAL_DATA === 'true',
  },
  cloud: {
    userPoolConfig: getUserPoolConfig(),
  },
  oauth: getOAuthEnvConfig(),
  slack: getSlackConfig(),
  baseUrl: getBaseUrlConfig(),
};

export default appConfig;
