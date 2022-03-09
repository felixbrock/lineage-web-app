import styled from 'styled-components';

export default styled.button`
color: #bbbbbb;
background-color: transparent;

border: 0px;

text-align: center;

&:active {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

&:hover {
  color: #000;
  background-color: #2c25ff;
  text-decoration: none;
  cursor: pointer;
}
`;