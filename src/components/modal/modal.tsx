import React, { ReactElement } from 'react';
import { Modal, Content, Close, Submit, Title } from './modal-items';
import Button from '../button/button';

export default (
  content: ReactElement,
  title: string,
  buttonName: string,
  setClose: (state: boolean) => void,
  setSubmit: (state: boolean) => void
): ReactElement => {
  const close = (): void => setClose(false);
  const submit = (): void => setSubmit(true);

  return (
    <Modal>
      <Content>
        <Close>
          <Button onClick={close}>&times;</Button>
        </Close>
        <Title>{title}</Title>
        {content}
        {buttonName ? <Submit>
          <Button onClick={submit}>{buttonName}</Button>
        </Submit> : null}
      </Content>
    </Modal>
  );
};
