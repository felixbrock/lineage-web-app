import React, { ReactElement } from 'react';
import { Nav, NavLink, Bars} from './nav-items';
import Logo from './hivedive180.svg';

export default (): ReactElement => (
  <Nav>
    <NavLink to="/lineage">
      <img src={Logo} alt="logo" />
    </NavLink>
    <Bars />
  </Nav>
);
