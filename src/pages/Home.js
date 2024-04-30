import React, { useEffect, useState } from 'react';
import Header from './Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { createChurch, getChurch } from '../apis/church';
import { Button, Modal } from 'antd';
import { openNotificationWithIcon } from '../utils/notification';

const Home = () => {
  const [showAddChurchPopup, setShowAddChurchPopup] = useState(false);
  const [churchData, setChurchData] = useState({});
  const [churchName, setChurchName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
      } else {
        const response = await getChurch(token);
        if (!response.success) {
          setShowAddChurchPopup(true);
        } else {
          setChurchData(response.church);
        }
      }
    })();
  }, []);

  const handleAddChurch = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (churchName === '' || address === '') {
      openNotificationWithIcon('error', 'خطأ', 'الرجاء ملء جميع الحقول');
      return;
    }

    const response = await createChurch(churchName, address, token);
    if (!response.success) {
      openNotificationWithIcon('error', 'خطأ', response.message);
      return;
    }
    openNotificationWithIcon('success', 'نجاح', 'تم إضافة الكنيسة بنجاح');
    setShowAddChurchPopup(false);
  }

  return (
    <>
      <Header churchData={churchData} />
      <div className='background-radial-gradient'>
        <MDBContainer fluid>
          <MDBRow className='justify-content-center vh-100'>
            <MDBCol md='8' className='text-center'>
              <img src='logo.png' alt='logo' className='d-block mx-auto mb-2 mt-5'
                style={{
                  width: '300px',
                }} />
              <h1 className='title-text'>الأمانة العامة لخدمة ثانوى بالاسكندرية</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', marginTop: '6rem' }}>
                <MDBCol className='sub-titlebaground'>
                  <a
                    href='https://drive.google.com/file/d/1kK8iJ2gXz4V5tZwq7Q8KwQ1Vq1Wvq6zv/view?usp=sharing'
                    target='_blank'
                    rel='noreferrer'
                    style={{ color: 'white', fontSize: "1.5em" }}
                  >
                    كراسة الشروط
                  </a>
                </MDBCol>
                <MDBCol className='sub-titlebaground'>
                  <a
                    href='/all-activites'
                    style={{ color: 'white', fontSize: "1.5em" }}
                  >
                    الاشتراك في المهرجان
                  </a>
                </MDBCol>
                <MDBCol className='sub-titlebaground'>
                  <a
                    href='/all-activites'
                    style={{ color: 'white', fontSize: "1.5em" }}
                  >
                    نتيجة المهرجان
                  </a>
                </MDBCol>
                {churchData.name && (
                  <MDBCol className='sub-titlebaground'>
                    <a
                      href='/all-activites'
                      style={{ color: 'white', fontSize: "1.5em" }}
                    >
                      كنيستك : <span style={{
                        textShadow: '2px 2px 4px #ff8000',
                      }}> {churchData.name} </span>
                    </a>
                  </MDBCol>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer >
      </div >
      {showAddChurchPopup && (
        <Modal
          visible={showAddChurchPopup}
          closable={false}
          footer={null}
          style={{ direction: 'rtl', textAlign: 'center', fontFamily: "Cairo", fontSize: "1.5rem" }}
        >
          <form style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h2 >الرجاء إضافة كنيستك</h2>
            <input type="text" className="form-control" placeholder="اسم الكنيسة" required onChange={(e) => setChurchName(e.target.value)} />
            <input type="text" className="form-control" placeholder="القطاع" required onChange={(e) => setAddress(e.target.value)} />
            <button type="submit" className="btn btn-primary" onClick={handleAddChurch}>إضافة</button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default Home;