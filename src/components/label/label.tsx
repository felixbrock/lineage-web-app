import React, { ReactElement } from 'react';
import Label from './label-items';

interface LabelProps {
  children?: React.ReactNode,
  onClick?: () => void,
}

const label = ({children, onClick}: LabelProps): ReactElement => (<Label onClick={onClick}>{children}</Label>);

label.defaultProps = {
  children: null,
  onClick: () => {}
};

export default label;