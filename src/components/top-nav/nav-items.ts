import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = styled.div`
  max-width: 31.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  height: 2.8rem;
  background: #f5f5f5;
  outline: none;
  border: none;
  border-radius: 1.625rem;
  padding: 0 3.5rem 0 1.5rem;
  font-size: 1rem;
`;

export const Submit = styled.button`
  width: 3.5rem;
  height: 2.8rem;
  margin-left: -3.5rem;
  background: none;
  border: none;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

export const IconSearch = styled(FaSearch)`
  width: 24px;
  height: 24px;
  viewbox: 0 0 24 24;
  fill: #666666;
`;
