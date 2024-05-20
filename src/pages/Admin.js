import React, { useEffect } from 'react';

const Admin = () => {

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
      }
    })();
  }, []);

  const handleAdminBackHome = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div class="section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 class="error">404</h1>
          <div class="page">صفة الادمن لا تزال قيد التطوير</div>
          <a href="/" class="back-home" onClick={handleAdminBackHome}>رجوع</a>
        </div>
      </div>
    </>
  );
};

export default Admin;