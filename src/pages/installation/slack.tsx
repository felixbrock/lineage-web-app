/* eslint-disable @typescript-eslint/dot-notation */
import { ReactElement } from 'react';
import { useSearchParams,useParams } from 'react-router-dom';


export default (): ReactElement => {
  console.log("code");
  const [searchParams] = useSearchParams();
  const {code} = useParams();
  console.log(searchParams.get('code'));
  console.log(code);
  
//   const url = "https://slack.com/api/oauth.v2.access?client_id=3743837702852.3728367364791&client_secret=bd2a44af39cb4eb6bed61f3aa4b50162&code="+code;
//   const response = fetch(url, {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/x-www-form-urlencoded'}
//   });
  
//   console.log("Response",response);
  
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axios = require('axios');

  const config = {
    method: 'post',
    url: 'https://slack.com/api/oauth.v2.access?client_id=3743837702852.3728367364791&client_secret=1fec399e9b4df09534572c709ad86fec&code='+code,
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Cookie': 'b=2a41a35826c0f18b93ff25842351fc71; x=2a41a35826c0f18b93ff25842351fc71.1657713965'
    }
  };

  axios(config)
  .then(function (response: { data: any }) {
    // console.log(JSON.stringify(response.data));
    const resdata = response.data;
    console.log("\n\nAccess Token: ",resdata["access_token"]);
    // get_token(res_data);
  })
  .catch(function (error: any) {
    console.log(error);
  });

  
  return <>
  <p>something</p>
  </>;
};

