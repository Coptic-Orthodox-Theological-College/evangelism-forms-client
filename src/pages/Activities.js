import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { createChurch, getChurch } from "../apis/church";
import { Button, Modal } from "antd";
import { openNotificationWithIcon } from "../utils/notification";
import { useLocation } from 'react-router-dom';

const Activities = () => {
      const location = useLocation();
  const churchData = location.state.churchData;

  useEffect(() => {
    (async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      }
    })();
  }, []);

  return (
    <>
      <Header churchData={churchData} />
      <div className="background-radial-gradient">
        <MDBContainer fluid>
          <MDBRow className="justify-content-center vh-100">
            <MDBCol md="8" className="text-center">
              <img
                src="logo.png"
                alt="logo"
                className="d-block mx-auto mb-2 mt-5"
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
                <MDBCol className="sub-titlebaground">
                  <a
                    href="https://drive.google.com/file/d/1kK8iJ2gXz4V5tZwq7Q8KwQ1Vq1Wvq6zv/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white", fontSize: "1.5em" }}
                  >
                    كراسة الشروط
                  </a>
                </MDBCol>
                <MDBCol className="sub-titlebaground">
                  <a
                    href="/all-activites"
                    style={{ color: "white", fontSize: "1.5em" }}
                  >
                    الاشتراك في المهرجان
                  </a>
                </MDBCol>
                <MDBCol className="sub-titlebaground">
                  <a
                    href="/all-activites"
                    style={{ color: "white", fontSize: "1.5em" }}
                  >
                    نتيجة المهرجان
                  </a>
                </MDBCol>
                {churchData.name && (
                  <MDBCol className="sub-titlebaground">
                    <a
                      href="/all-activites"
                      style={{ color: "white", fontSize: "1.5em" }}
                    >
                      كنيستك :{" "}
                      <span
                        style={{
                          textShadow: "2px 2px 4px #ff8000",
                        }}
                      >
                        {" "}
                        {churchData.name}{" "}
                      </span>
                    </a>
                  </MDBCol>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
};

export default Activities;
