import { ReactElement } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import TopNav from './components/top-nav/top-nav';
import './App.css';
import Footer from './components/footer/footer';
import {
  HeaderContainer,
  ContentContainer,
  FooterContainer,
  App,
} from './App-Items';
import Lineage from './pages/lineage/lineage';

export default (): ReactElement => (
  <div className="App">
    <App>
      <Router>
        <HeaderContainer>
          <TopNav />
        </HeaderContainer>
        <ContentContainer>
          <Routes>
            <Route path="/lineage" element={<Lineage/>} />
            <Route path="/" element={<Navigate to="/lineage"/>}/>
          </Routes>
        </ContentContainer>
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </Router>
    </App>
  </div>
);
