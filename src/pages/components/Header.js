import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = ({ churchData }) => {
  const navigate = useNavigate();
  const [showNavbarSecondary, setShowNavbarSecondary] = useState(false);
  const [openNav, setOpenNav] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('church');
    sessionStorage.removeItem('church');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light' dir='rtl' >
      <MDBNavbarBrand>
        <img src={logo} alt='logo' loading='lazy' className='logo-header' onClick={() => navigate('/home')} />
        {churchData && (
          <MDBNavbarLink onClick={() => window.location.href = `/church`}>{churchData.name}</MDBNavbarLink>
        )}
      </MDBNavbarBrand>
      <MDBNavbarToggler
        type='button'
        aria-expanded='false'
        aria-label='Toggle navigation'
        onClick={() => setOpenNav(!openNav)}
      >
        <MDBIcon icon='bars' fas />
      </MDBNavbarToggler>
      <MDBCollapse navbar open={openNav} style={{
        marginRight: '45px',
      }}>
        <MDBNavbarNav>
          <MDBNavbarItem>
            <MDBNavbarLink href='#'>من نحن</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='#'>خدماتنا</MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href='#'>تواصل معنا</MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>
        <div style={{
          marginLeft: '20px',
        }}>
          <MDBBtn color='danger' onClick={handleLogout} className='logout-btn'>
            تسجيل خروج
          </MDBBtn>
        </div>
      </MDBCollapse>
    </MDBNavbar >
  );
};

export default Header;