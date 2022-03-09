export default (serviceName: string, port: string, path: string): string => {
  let root = '';
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      root = `http://localhost:${port}/${path}`;
      break;
    case 'test':
      root = `https://bff-test.hivedive.io/${serviceName}-service/${path}`;
      break;
    case 'production':
      root = `https://bff.hivedive.io/${serviceName}-service/${path}`;
      break;
    default:
      break;
  }

  return root;
};
