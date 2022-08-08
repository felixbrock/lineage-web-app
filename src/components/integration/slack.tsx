/* eslint-disable @typescript-eslint/dot-notation */
import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from '@mui/material';
import axios from 'axios';

interface ChannelInfo {
  id: string;
  name: string;
}

export default (): ReactElement => {
  const [channels, setChannels] = useState<ChannelInfo[]>([]);

  console.log('code');
  // const [searchParams] = useSearchParams();

  const { code } = useParams();
  console.log(code);

  const buildOAuthUrl = (accountId: string) => {
    const clientId = encodeURIComponent('3334524827045.3900369988422');
    const scopes = encodeURIComponent('channels:read,channels:join,chat:write,groups:read,im:read,mpim:read');   

    return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&state=${accountId}`;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3031/test2`)
      .then((res) => {
        const jsonResponse = res.data;
        console.log('jsonResponse');
        if (res.status !== 200) Promise.reject(jsonResponse);
        setChannels(res.data);
      })
      .catch((error: any) => {
        console.trace(error);
      });
  }, []);

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

  return (
    <>
      <Button href={buildOAuthUrl('todo')}>{'Install'}</Button>
      <p>something</p>
      <p>{JSON.stringify(channels)}</p>
    </>
  );
};
