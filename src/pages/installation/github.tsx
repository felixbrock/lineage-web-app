import { ReactElement } from 'react';
import { useParams} from 'react-router-dom';


export default (): ReactElement => {
  
  const {code} = useParams();
  
  // todo - find workaround for rerouting bug in case of code query param
  
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axios = require('axios');
  
  const config = {
    method: 'post',
    url: 'https://github.com/login/oauth/access_token?client_id=Iv1.047f21a6fd820239&client_secret=32c5569a5d325a796e58ef00509ccc04cefb198b&code=' + code,
    headers: { }
  };

  axios(config)
  .then(function (response: { data: any; }) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error: any) {
    console.log(error);
  });

  return <>
  <p>something</p>
  {code }</>;
};
