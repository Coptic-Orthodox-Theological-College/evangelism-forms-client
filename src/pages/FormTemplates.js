import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { createChurch, getChurch } from "../apis/church";
import { Button, Modal } from "antd";
import { openNotificationWithIcon } from "../utils/notification";
import { listActivities } from "../apis/activities";
import { listFormTemplatesByActivity } from "../apis/formTemplate";
import { Link, useNavigate } from "react-router-dom";

const FormTemplates = () => {
  const [churchData, setChurchData] = useState({});
  const activityId = window.location.pathname.split("/")[2];
  const [allFormTemplates, setAllFormTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      } else {
        setChurchData(JSON.parse(localStorage.getItem("church")));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await listFormTemplatesByActivity(activityId);
      if (!response.success) {
        openNotificationWithIcon("error", "خطأ", response.message);
        return;
      } else {
        setAllFormTemplates(response.formTemplates);
      }
    })();
  }, [activityId]);

  return (
    <>
      <Header churchData={churchData} />
      <div className="background-radial-gradient">
        <MDBContainer fluid>
          <MDBRow className="justify-content-center vh-100">
            <MDBCol md="8" className="text-center">
              <h1 className="title-text mb-2 mt-5">
                انشطة مهرجان ثانوى 2024
              </h1>
              <div className="continer-activities" style={{ marginTop: "6rem" }}>
                {allFormTemplates.map((formTemplate, index) => (
                  <MDBCol key={index}>
                    <div className="sub-titlebaground" onClick={() => navigate(`/form-submit/${formTemplate._id}`)}>
                      <div style={{ color: "white", fontSize: "1.5em", textDecoration: 'none' }}>
                        {formTemplate.name}
                        <br />
                        <p style={{ fontSize: "0.5em" }}>{formTemplate.description}</p>
                      </div>
                    </div>
                  </MDBCol>
                ))}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
};

export default FormTemplates;
