import React, { ReactElement } from 'react';
import { Auth } from 'aws-amplify';
import { Nav, NavLink, Bars, NavMenu, NavBtn} from './nav-items';
import Logo from './hivedive180.svg';

export default (): ReactElement => (
  <Nav>
    <NavLink to="/systems">
      <img src={Logo} alt="logo" />
    </NavLink>
    <Bars />
    <NavMenu>
      <NavLink to="/systems">Systems</NavLink>
      <NavLink to="/automations">Automations</NavLink>
      <NavLink to="/historical-data">Historical Data</NavLink>
      {/* Second Nav */}
      {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
    </NavMenu>
    <NavBtn onClick={() => Auth.signOut()}>Sign Out</NavBtn>
  </Nav>
);
