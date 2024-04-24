import React from 'react';
import Header from './Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

const Home = () => {
  return (
    <>
      <Header />
      <div className='background-radial-gradient'>
        <MDBContainer fluid>
          <MDBRow className='justify-content-center vh-100'>
            <MDBCol md='8' className='text-center'>
              <img src='logo.png' alt='logo' className='d-block mx-auto mb-2 mt-5'
                style={{
                  width: '300px',
                }} />
              <h1 className='title-text'>الأمانة العامة لخدمة ثانوى بالاسكندرية</h1>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
};

export default Home;