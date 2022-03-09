import styled from 'styled-components';
import { FaRegChartBar, FaRegCopy, FaEllipsisV } from 'react-icons/fa';

export const System = styled.div`
  text-align: center;
  border: 1px solid #333333;
  margin: 3px;
  background-color: #333333;
`;

const SystemRow = styled.div`
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  margin: 10px;
`;

export const Header = styled(SystemRow)`
  
`;

export const MissedAlertBubble = styled.span`
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  font-size: 9pt;
  color: #fff;
  text-align: center;
  background: #fd0304;
`;

export const Title = styled.div`
  color: #bbbbbb;
  font-size: 12pt;
  text-decoration: underline;
`;

export const OptionsIcon = styled(FaEllipsisV)`
  color: #bbbbbb;
  vertical-align: middle;
`;

export const IdInfo = styled(SystemRow)``;

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
  height: 30%;
  padding: 0px;

  @media screen and (max-width: 1000px) {
    height: 30%;
  }
`;

export const Footer = styled(SystemRow)`
  margin: 10px;
`;
