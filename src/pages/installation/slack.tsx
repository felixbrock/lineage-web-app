/* eslint-disable @typescript-eslint/dot-notation */
import { ReactElement } from 'react';
import {useParams } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { conversations } from "slack";


export default (): ReactElement => {

  console.log("code");
  // const [searchParams] = useSearchParams();

  const {code} = useParams();
  console.log(code);

  function selectchannel(token:string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { WebClient } = require('@slack/web-api');
    const web = new WebClient(token);
    const channels:string[] = [];
    
    const allChannels = web.conversations.list({ exclude_archived: true, types: 'public_channel' });
    for (let index = 0; index < allChannels['channels'].length; index++) {
      channels.push(allChannels['channels'][index]);
    }
    return channels;
    // const {c} = channels;
  }

  const token = "xoxb-3334524827045-3719775261619-KcrEgKlq3xWHAwimVSOeEcr3";
  const channels = selectchannel(token);

  

//   // console.log(searchParams.get('code'));
  
  
// //   const url = "https://slack.com/api/oauth.v2.access?client_id=3743837702852.3728367364791&client_secret=bd2a44af39cb4eb6bed61f3aa4b50162&code="+code;
// //   const response = fetch(url, {
// //     method: 'POST',
// //     headers: {
// //         'Accept': 'application/json',
// //         'Content-Type': 'application/x-www-form-urlencoded'}
// //   });
  
// //   console.log("Response",response);
  
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const axios = require('axios');

//   const config = {
//     method: 'post',
//     url: 'https://slack.com/api/oauth.v2.access?client_id=3334524827045.3705229963495&client_secret=7837a3d402c4f82061fdb1991a98be84&code='+code,
//     headers: { 
//       'Content-Type': 'application/x-www-form-urlencoded'
//       // 'Cookie': 'b=2a41a35826c0f18b93ff25842351fc71; x=2a41a35826c0f18b93ff25842351fc71.1657713965'
//     }
//   };

//   axios(config)
//   .then(function (response: { data: any }) {

//     const resdata = response.data;
//     const token = resdata["access_token"];
//     selectchannel(token);


//     // Get all the channel and display to the User and get the sleected channel from the user
    

//     // Store Access Token, Channel ID, Workspace ID, Workspace Name to MongoDB

//     // 
//   })
//   .catch(function (error: any) {
//     console.log(error);
//   });

  
  
  return <>
  <p>something</p>
  <p>{channels}</p>
  </>;
};

