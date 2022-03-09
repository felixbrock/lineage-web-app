import styled from 'styled-components';

export const Modal = styled.div`
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.4);
`;

export const Content = styled.div`
  background-color: #333333;
  color: #bbbbbb;
  margin: auto;
  padding: 20px;
  width: 60%;
  max-height: 80%;
  overflow: hidden;
  overflow-y: scroll;
`;

export const Title = styled.h3`
text-align: center;
`;

export const Close = styled.div`
  float: right;
  font-weight: bold;
  font-size: 15pt;
  border: 0px;
`;

export const Submit = styled.div`
  float: right;
  font-size: 9pt;
  border: 1px solid;
`;
