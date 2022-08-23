export default (gateway: string, path: string): string => {
  let root = '';
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      root = `http://${gateway}/${path}`;
      break;
    case 'test':
      root = ``;
      break;
    case 'production':
      root = `https://${gateway}/${path}`;
      break;
    default:
      break;
  }

  return root;
};
