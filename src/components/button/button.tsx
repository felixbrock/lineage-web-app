import React, { ReactElement } from 'react';
import Button from './button-items';

interface ButtonProps {
  children?: React.ReactNode,
  onClick?: () => void,
}

const button = ({children, onClick}: ButtonProps): ReactElement => (<Button onClick={onClick}>{children}</Button>);

button.defaultProps = {
  children: null,
  onClick: () => {}
};

export default button;