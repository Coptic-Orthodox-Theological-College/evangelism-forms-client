import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import FormSubmit from './pages/FormSubmit';
import NotFound404 from './pages/NotFound404';
import Admin from './pages/Admin';
import Activities from './pages/Activities';
import FormTemplates from './pages/FormTemplates';
import Church from './pages/Church';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/all-activities" element={<Activities />} />
        <Route path="/form-templates/:activityId" element={<FormTemplates />} />
        <Route path="/form-submit/:formTemplateId" element={<FormSubmit />} />
        <Route path="/church" element={<Church />} />
        {/* 404 */}
        <Route path="*" element={<NotFound404 />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;