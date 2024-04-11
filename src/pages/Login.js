import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { openNotificationWithIcon } from '../utils/notification';

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/home');
  //   }
  // }, [isAuthenticated]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  }

  const handleLoginClick = () => {
    console.log('username:', username);
    if (username === '') {
      openNotificationWithIcon('error', 'خطأ', 'الرجاء إدخال اسم المستخدم');
      return;
    }
    console.log('password:', password);
    if (password === '') {
      openNotificationWithIcon('error', 'خطأ', 'الرجاء إدخال كلمة المرور');
      return;
    }
    console.log('rememberMe:', rememberMe);
    // setIsAuthenticated(true);
    // navigate('/home');
  }

  return (
    <div className='custom-container'>
      <MDBContainer fluid className='p-4 background-radial-gradient w-50 custom-container-card '>
        <MDBRow className='justify-content-center'>
          <MDBCol md='6' className='position-relative'>
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
            <MDBCard className='my-5 bg-glass'>
              <MDBCardBody className='p-5'>
                <img src='mainLogo.png' alt='logo' className='d-block mx-auto mb-4'
                  style={{
                    width: '300px',
                  }} />
                <h4 className='text-center mb-4'>تسجيل الدخول</h4>
                <MDBInput wrapperClass='mb-4' label='اسم المستخدم' id='form1' type='text' onChange={handleUsernameChange} />
                <MDBInput wrapperClass='mb-2' label='كلمة المرور' id='form2' type='password' onChange={handlePasswordChange} />
                <div dir='rtl' className='d-flex justify-content-center gap-2 mb-2'>
                  <MDBCheckbox id='checkbox1' onChange={handleRememberMeChange} />
                  <label className='form-check-label' htmlFor='checkbox1'>تذكرني</label>
                </div>

                <MDBBtn
                  className='w-100 mb-4'
                  size='md'
                  onClick={handleLoginClick}
                >
                  تسجيل الدخول
                </MDBBtn>

                <div className="text-center">
                  <p>تواصل معانا</p>
                  <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                    <MDBIcon fab icon='facebook-f' size="lg" />
                  </MDBBtn>
                  <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#25d366' }}>
                    <MDBIcon fab icon='whatsapp' size="lg" />
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Login;