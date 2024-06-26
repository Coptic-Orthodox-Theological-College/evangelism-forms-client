import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { createChurch, getChurch } from "../apis/church";
import { Modal, Select } from "antd";
import { openNotificationWithIcon } from "../utils/notification";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import WaveSvg from "./components/WaveSvg";

const Home = () => {
  const navigate = useNavigate();
  const [showAddChurchPopup, setShowAddChurchPopup] = useState(false);
  const [churchData, setChurchData] = useState({});
  const [churchName, setChurchName] = useState("");
  const [address, setAddress] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      } else {
        if (!localStorage.getItem("church")) {
          const response = await getChurch(token);
          if (!response.success) {
            setShowAddChurchPopup(true);
          } else {
            localStorage.setItem("church", JSON.stringify(response.church));
            setChurchData(response.church);
          }
        } else {
          setChurchData(JSON.parse(localStorage.getItem("church")));
        }
      }
    })();
  }, []);

  const handleAddChurch = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (churchName === "" || address === "" || responsiblePerson === "" || phone === "") {
      openNotificationWithIcon("error", "خطأ", "الرجاء ملء جميع الحقول");
      return;
    }

    if (phone.length !== 11) {
      openNotificationWithIcon("error", "خطأ", "رقم الهاتف يجب أن يكون 11 رقم");
      return;
    }

    const response = await createChurch(churchName, address, token, responsiblePerson, phone);
    if (!response.success) {
      openNotificationWithIcon("error", "خطأ", response.message);
      return;
    }
    openNotificationWithIcon("success", "نجاح", "تم إضافة الكنيسة بنجاح");
    setShowAddChurchPopup(false);
    window.location.href = "/";
  };

  const handleCancelPopup = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("church");
    window.location.href = "/";
  }

  return (
    <>
      <Header churchData={churchData} />
      <div className="background-radial-gradient"
        style={{
          minHeight: "100vh",
          paddingBlock: "5rem",
        }}
      >
        <MDBContainer fluid>
          <MDBRow className="justify-content-center">
            <MDBCol md="8" className="text-center">
              <img
                src={logo}
                alt="logo"
                className="d-block mx-auto mb-2"
                style={{
                  width: "300px",
                }}
              />
              <h1 className="title-text">
                الأمانة العامة لخدمة ثانوى بالاسكندرية
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  alignItems: "center",
                  marginTop: "6rem",
                }}
              >
                <MDBCol className="sub-titlebaground home">
                  <a
                    href="https://drive.google.com/file/d/1oBLnHz48tcam6cRjO497Patyrag2Rw2w/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white", fontSize: "1.5em" }}
                  >
                    كراسة الشروط
                  </a>
                </MDBCol>
                <MDBCol className="sub-titlebaground home" style={{ cursor: "pointer" }} onClick={() => navigate('/all-activities')}>
                  <div
                    style={{ color: "white", fontSize: "1.5em" }}
                  >
                    الاشتراك في المهرجان
                  </div>
                </MDBCol>
                <MDBCol className="sub-titlebaground home" style={{ cursor: "pointer" }} onClick={() => window.location.href = '/result'}>
                  <div
                    style={{ color: "white", fontSize: "1.5em" }}
                  >
                    نتيجة المهرجان
                  </div>
                </MDBCol>
                {churchData.name && (
                  <MDBCol className="sub-titlebaground home" style={{ cursor: "pointer" }} onClick={() => window.location.href = '/church'}>
                    <div style={{ color: "white", fontSize: "1.5em" }}>
                      كنيستك :{" "}
                      <span
                        style={{
                          textShadow: "2px 2px 4px #ff8000",
                        }}
                      >
                        {" "}
                        {churchData.name}{" "}
                      </span>
                    </div>
                  </MDBCol>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <WaveSvg />
      </div>
      {showAddChurchPopup && (
        <Modal
          visible={showAddChurchPopup}
          closable={false}
          footer={null}
          style={{
            direction: "rtl",
            textAlign: "center",
            fontFamily: "Cairo",
            fontSize: "1.5rem",
          }}
        >
          <form
            style={{
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <h2>الرجاء إضافة كنيستك</h2>
            <input
              type="text"
              className="form-control"
              placeholder="اسم الكنيسة"
              required
              onChange={(e) => setChurchName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="الخادم المسؤول"
              required
              onChange={(e) => setResponsiblePerson(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="رقم الهاتف"
              required
              onChange={(e) => {
                if (isNaN(e.target.value)) {
                  return;
                }
                setPhone(e.target.value);
              }}
            />
            <Select
              placeholder="القطاع"
              style={{
                width: "100%",
                fontFamily: 'Cairo',
              }}
              onChange={(value) => setAddress(value)}
            >
              <Select.Option value="شرق 1">شرق 1</Select.Option>
              <Select.Option value="شرق 2">شرق 2</Select.Option>
              <Select.Option value="غرب">غرب</Select.Option>
              <Select.Option value="وسط">وسط</Select.Option>
              <Select.Option value="منتزة 1">منتزة 1</Select.Option>
              <Select.Option value="منتزة 2">منتزة 2</Select.Option>
            </Select>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleAddChurch}
              >
                إضافة
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelPopup}
              >
                إلغاء
              </button>
            </div>
          </form>
        </Modal >
      )}
    </>
  );
};

export default Home;
