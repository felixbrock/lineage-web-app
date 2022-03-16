import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

export const Lineage = styled.div`
height: 100%
`;

export const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HivediveLogo = styled.img`
  display: inline-block;
`;

export const SearchBar = styled.div`
  margin: auto;
  margin-top: 10px;
  width: 50%;
  max-width: 31.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const InputWrapper = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  position: relative;
`;

export const Input = styled.input`
  font-size: inherit;
  padding-left: 0.5rem;
  padding-right: 1rem;
  height: 2rem;
  width: 20rem;
  overflow-wrap: break-word;
  border: 1px solid gray;
  position: absolute;
  border-radius: 50px;
  word-wrap: break-word;
  background-color: transparent;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  -ms-border-radius: 50px;
  -o-border-radius: 50px;
`;

export const InputSuggestion = styled(Input)`
  z-index: -1;
  color: gray;
  cursor: none;
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