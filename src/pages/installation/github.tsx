import { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';


export default (): ReactElement => {
  const [searchParams] = useSearchParams();
  
  const code = searchParams.get('code');
  console.log(searchParams.get('code'));
  console.log(searchParams, 'params');
  
  

  return <>
  <p>something</p>
  {code }</>;
};
