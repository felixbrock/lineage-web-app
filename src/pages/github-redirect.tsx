import { useNavigate, useParams } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  const { code, state } = useParams();
  console.log(code);
  console.log(state);

  navigate(`/lineage`, {
    state: {},
  });

  return <></>;
};