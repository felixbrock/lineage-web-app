import { ReactElement } from 'react';
import { useSearchParams,useParams } from 'react-router-dom';


export default (): ReactElement => {
  const [searchParams] = useSearchParams();
  const {code} = useParams();
  console.log(searchParams.get('code'));
  console.log(code);
  return <>
  <p>something</p>
  {code }</>;
};

