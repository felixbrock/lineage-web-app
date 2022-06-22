import { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';


export default (): ReactElement => {
  const [searchParams] = useSearchParams();
  
  const code = searchParams.get('test');
  console.log(searchParams.get('test'));
  console.log(searchParams.get('code'));
  console.log(searchParams, 'params');
  
  // todo - find workaround for rerouting bug in case of code query param
  

  return <>
  <p>something</p>
  {code }</>;
};
