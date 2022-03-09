import React, { ReactElement } from 'react';
import { Table, TR, TD, TH } from './table-items';

export default (headers: string[], rows: any[][]): ReactElement => {
  // eslint-disable-next-line react/destructuring-assignment
  const headerElements: ReactElement[] = headers.map((header) => (
    <TH>{header}</TH>
  ));

  // eslint-disable-next-line react/destructuring-assignment
  const rowElements: ReactElement[] = rows.map((row) => (
    <TR>
      {row.map((cell) => (
        <TD>{cell}</TD>
      ))}
    </TR>
  ));

  return (
    <Table>
      <thead><TR>{headerElements}</TR></thead>
      <tbody>{rowElements}</tbody>
    </Table>
  );
};
