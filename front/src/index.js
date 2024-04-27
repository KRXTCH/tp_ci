import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import UserManager from './Pages/UserManager';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <Routes>
      <Route path="/tp_ci/mongo" element={<UserManager port={3000} />}>
      </Route>
      <Route path="/tp_ci/mysql" element={<UserManager port={5000} />}>
      </Route>
      <Route path="/tp_ci" element={<App />}>
      </Route>
    </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
