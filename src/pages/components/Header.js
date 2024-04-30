import React from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBContainer,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = ({ churchData }) => {
  const navigate = useNavigate();
  const [showNavbarSecondary, setShowNavbarSecondary] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('church');
    window.location.href = '/';
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light' className='header-navbar'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/home'>
          <img src={logo} alt='logo' loading='lazy' className='logo-header' />
        </MDBNavbarBrand>
        <MDBNavbarToggler
          type='button'
          data-target='#navbarSecondary'
          aria-controls='navbarSecondary'
          aria-expanded='false'
          aria-label='تبديل التنقل'
          onClick={() => setShowNavbarSecondary(!showNavbarSecondary)}
        >
          <span className='navbar-toggler-icon'></span>
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showNavbarSecondary} className='navbar-collapse'>
          <MDBNavbarNav>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                الرئيسية
              </MDBNavbarLink>
            </MDBNavbarItem>
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
          {churchData && (
            <MDBNavbarNav right>
              <MDBNavbarItem>
                <MDBNavbarLink onClick={() => navigate(`church/${churchData._id}`)}>{churchData.name}</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          )}
          <MDBBtn color='danger' onClick={handleLogout} className='logout-btn'>
            تسجيل خروج
          </MDBBtn>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar >
  );
};

export default Header;