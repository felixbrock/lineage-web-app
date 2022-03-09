import styled from 'styled-components';
import {FaRegChartBar, FaRegCopy, FaEllipsisV } from 'react-icons/fa';

export const Selector = styled.div`
  text-align: center;
  border: 1px solid #333333;
  margin: 3px;
  background-color: #333333;
`;

const SelectorRow = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  margin: 10px;
`;

export const Header = styled(SelectorRow)``;

export const MissedAlertBubble = styled.button`
  width: 20px;
  height: 20px;
  line-height: 9pt;
  border-radius: 50%;
  font-size: 9pt;
  padding: 1px;
  color: #fff;
  text-align: center;
  background: #fd0304;

  border: 0px;

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

export const Title = styled.div`
  color: #bbbbbb;
  font-size: 12pt;
`;

export const OptionsIcon = styled(FaEllipsisV)`
  color: #bbbbbb;
  vertical-align: middle;
`;

export const IdInfo = styled(SelectorRow)``;

export const Text = styled.div`
  color: #7f7f7f;
  font-size: 10pt;
`;

export const CopyIdIcon = styled(FaRegCopy)`
  color: #7f7f7f;
  vertical-align: middle;
`;

export const StatsIcon = styled(FaRegChartBar)`
  color: #7f7f7f;
  vertical-align: middle;
`;

export const Subtitle = styled.div`
  color: #bbbbbb;
  font-size: 11pt;
`;

export const AlertMap = styled.div`
  display: inline-block;
  width: 70%;
  padding: 0px;

  @media screen and (max-width: 1000px) {
    width: 60%;
  }
`;

export const Footer = styled(SelectorRow)`
  margin: 10px;
`;

export const Subscribe = styled.div`
  font-size: 9pt;
`;
