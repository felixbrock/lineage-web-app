import { ReactElement } from 'react';
import { useSearchParams,useParams } from 'react-router-dom';


export default (): ReactElement => {
  console.log("code");
  const [searchParams] = useSearchParams();
  const {code} = useParams();
  console.log(searchParams.get('code'));
  console.log(code);
  
  const url = "https://slack.com/api/oauth.v2.access?client_id=3743837702852.3728367364791&client_secret=bd2a44af39cb4eb6bed61f3aa4b50162&code="+code;
  const response = fetch(url, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'}
  });
  
  console.log("Response",response);
  
  return <>
  <p>something</p>
  {code }
  {response}</>;
};

