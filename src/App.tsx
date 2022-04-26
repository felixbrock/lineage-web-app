import { ReactElement } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import './App.scss';
import Lineage from './pages/lineage/lineage';

export default (): ReactElement => (
  <div className="App">
    <div id='app'>
      <Router>
        <div id='ContentContainer'>
          <Routes>
            <Route path="/lineage" element={<Lineage/>} />
            <Route path="/" element={<Navigate to="/lineage"/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  </div>
);
