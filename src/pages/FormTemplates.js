import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { createChurch, getChurch } from "../apis/church";
import { Button, Modal } from "antd";
import { openNotificationWithIcon } from "../utils/notification";
import { listActivities } from "../apis/activities";
import { listFormTemplatesByActivity } from "../apis/formTemplate";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import WaveSvg from "./components/WaveSvg";

const FormTemplates = () => {
  const [churchData, setChurchData] = useState({});
  const activityId = window.location.pathname.split("/")[2];
  const [allFormTemplates, setAllFormTemplates] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [showEditOrAddSubmition, setShowEditOrAddSubmition] = useState(false);
  const [selectedFormTemplate, setSelectedFormTemplate] = useState(null);
  const [allSubmitionsForSelectedFormTemplate, setAllSubmitionsForSelectedFormTemplate] = useState([]);

  useEffect(() => {
    (async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      } else {
        setChurchData(JSON.parse(localStorage.getItem("church")));
        const userIdExist = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        setUserId(userIdExist);
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

  const handelClick = (formTemplate) => () => {
    if (formTemplate.submttedBy?.find((item) => item.userId === userId)) {
      setSelectedFormTemplate(formTemplate);
      setShowEditOrAddSubmition(true);
      const submitions = formTemplate.submttedBy?.filter((item) => item.userId === userId);
      setAllSubmitionsForSelectedFormTemplate(submitions);
    } else {
      navigate(`/form-submit/${formTemplate._id}`)
    }
  };

  return (
    <>
      <Header churchData={churchData} />
      <div className="background-radial-gradient"
        style={{
          minHeight: "100vh",
          paddingBottom: "5rem",
        }}
      >
        <MDBContainer fluid>
          <MDBRow className="justify-content-center">
            <MDBCol md="8" className="text-center">
              <h1 className="title-text mb-2 mt-5">
                انشطة مهرجان ثانوى 2024
              </h1>
              <div className="continer-activities" style={{ marginTop: "6rem" }}>
                {allFormTemplates.map((formTemplate, index) => (
                  <MDBCol key={index}>
                    <div className="sub-titlebaground" onClick={handelClick(formTemplate)}>
                      {formTemplate.submttedBy?.find((item) => item.userId === userId) ? (
                        <div style={{
                          color: "#366900",
                          fontSize: "0.8em",
                          backgroundColor: "#ffffffc7",
                          borderRadius: "0.5em",
                          width: "90%",
                          margin: "0 auto",
                        }}>
                          {formTemplate.submttedBy?.filter((item) => item.userId === userId).length === 1 ?
                            "تم التقديم" :
                            `تم التقديم ${formTemplate.submttedBy?.filter((item) => item.userId === userId).length} مرات`}
                          {" "}
                          ✅
                        </div>
                      ) : null}
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
        {showEditOrAddSubmition && (
          <Modal
            open={showEditOrAddSubmition}
            footer={null}
            onCancel={() => setShowEditOrAddSubmition(false)}
            style={{
              direction: "rtl",
              textAlign: "center",
              fontFamily: "Cairo",
              fontSize: "1.5rem",
              minWidth: "fit-content",
              margin: "0 auto",
            }}
          >
            <h4>{"التقديمات السابقة : " + selectedFormTemplate.name}</h4>
            <div
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                {allSubmitionsForSelectedFormTemplate.map((submition, index) => (
                  <div key={index}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      backgroundColor: "#ffffffc7",
                      borderRadius: "0.5em",
                      padding: "0.5em",
                      flexDirection: "column"
                    }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center"
                      }}
                    >
                      <div
                        className="submition-card"
                        onClick={() => {
                          navigate(`/form-submit/${selectedFormTemplate._id}?submitionId=${submition.submissionId}`)
                        }}>
                        #
                        {index + 1}
                        {" "}
                        تم التقديم فى تاريخ:
                        {" "}
                        {new Date(submition.submittedAt).toLocaleDateString()}
                        {" "}
                        -
                        الساعة:
                        {" "}
                        {new Date(submition.submittedAt).toLocaleTimeString()}
                      </div>
                      <Button onClick={() =>
                        navigate(`/form-submit/${selectedFormTemplate._id}?submitionId=${submition.submissionId}`)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Button>
                      {/* TODO: Add delete submition */}
                      <Button onClick={() => { }} danger>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-primary"
                  onClick={() => { navigate(`/form-submit/${selectedFormTemplate._id}`) }}
                >
                  إضافة جديد
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default FormTemplates;
