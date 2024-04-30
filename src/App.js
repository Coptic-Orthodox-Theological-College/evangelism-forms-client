import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import FormSubmit from './pages/FormSubmit';
import NotFound404 from './pages/NotFound404';
import Admin from './pages/Admin';
import Activities from './pages/Activities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/form-submit" element={<FormSubmit />} />
        <Route path="/all-activities" element={<Activities />} />
        {/* 404 */}
        <Route path="*" element={<NotFound404 />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;