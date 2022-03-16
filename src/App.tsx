import { ReactElement } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import './App.css';
import {
  ContentContainer,
  App,
} from './App-Items';
import Lineage from './pages/lineage/lineage';

export default (): ReactElement => (
  <div className="App">
    <App>
      <Router>
        <ContentContainer>
          <Routes>
            <Route path="/lineage" element={<Lineage/>} />
            <Route path="/" element={<Navigate to="/lineage"/>}/>
          </Routes>
        </ContentContainer>
      </Router>
    </App>
  </div>
);
