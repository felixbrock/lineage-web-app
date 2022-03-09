import styled from 'styled-components';
import { FaPlus } from 'react-icons/fa';

export const Systems = styled.div``;

export const SystemRow = styled.div`
  margin: 0 -5px;
`;

export const SystemColumn = styled.div`
  float: left;
  width: 25%;
  padding: 0 5px;

  @media screen and (max-width: 1000px) {
    width: 50%;
  }
`;

export const FloatingButton = styled.button`
  position: fixed;
  width: 40px;
  height: 40px;
  bottom: 40px;
  right: 40px;
  background-color: #2c25ff;
  color: #fff;
  border-radius: 40px;
  border: 0px;
  text-align: center;

  &:hover {
    background-color: #000;
    color: #2c25ff;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const IconAdd = styled(FaPlus)`
  vertical-align: middle;
`;

export const FieldLabel = styled.p`
  margin-left: 10px;
`;

export const HeatmapElement = styled.div`
vertical-align: middle;
padding: 0% 15% 0% 15%;  
`;
