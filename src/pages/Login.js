import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBCheckbox, MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { openNotificationWithIcon } from '../utils/notification';
import { login } from '../apis/user';

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      userType === 'admin' ? navigate('/admin') : navigate('/home');
    }
  }, [isAuthenticated]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setShowErrors(false);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowErrors(false);
  }

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  }

  const handleLoginClick = async () => {
    if (username === '' || password === '') {
      setShowErrors(true);
      return;
    }

    try {

      const response = await login(username, password);

      if (!response.success) {
        openNotificationWithIcon('error', 'خطأ', response.message);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
      } else {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('userId', response.userId);
      }

      setUserType(response.role);

      setIsAuthenticated(true);
    } catch (error) {
      openNotificationWithIcon('error', 'خطأ', "حدث خطأ ما، الرجاء المحاولة مرة أخرى لاحقاً");
    }
  }

  return (
    <div className='custom-container'>
      <MDBContainer fluid className='p-4 background-radial-gradient custom-container-card '>
        <MDBRow className='justify-content-center'>
          <MDBCol md='6' className='position-relative'>
            <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
            <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
            <MDBCard className='my-5 bg-glass'>
              <MDBCardBody className='p-5' style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <img src='mainLogo.png' alt='logo' className='d-block mb-4'
                  style={{
                    width: '300px',
                  }} />
                <h4 className='text-center mb-4'>تسجيل الدخول</h4>
                {username === '' && showErrors && <span className='sign-in-error-message'>الرجاء إدخال اسم المستخدم</span>}
                <MDBInput
                  wrapperClass='mb-4'
                  label='اسم المستخدم'
                  id='form1'
                  type='text'
                  onChange={handleUsernameChange}
                />
                {password === '' && showErrors && <span className='sign-in-error-message'>الرجاء إدخال كلمة المرور</span>}
                <MDBInput
                  wrapperClass='mb-2'
                  label='كلمة المرور'
                  id='form2'
                  type='password'
                  onChange={handlePasswordChange}
                />
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