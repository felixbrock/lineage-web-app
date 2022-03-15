import React, { ReactElement } from 'react';
import { IconSearch, Input, SearchBar, Submit } from './nav-items';
import Logo from './hivedive180.svg';

export default (): ReactElement => (
  <div>
    <img src={Logo} alt="logo" />
    <SearchBar>
      <Input type="text" placeholder="e.g. Search for 'f/2' or 'x/5'" />
      <Submit type="submit" >
        <IconSearch />
      </Submit>
    </SearchBar>
  </div>
);
