import styled from 'styled-components';

export const App = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'header'
    'content'
    'footer';
`;

export const HeaderContainer = styled.div`
  grid-area: header;
`;

export const ContentContainer = styled.div`
  margin: 10px;
  grid-area: content;
`;

export const FooterContainer = styled.div`
  grid-area: footer;
`;
