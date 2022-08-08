import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  console.log(searchParams);


  const { code, state } = useParams();
  console.log(code);
  console.log(state);

  navigate(`/lineage`, {
    state: {},
  });

  return <></>;
};