import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { getChurch, updateChurch, getAllChurchSubbmissions } from "../apis/church";
import { openNotificationWithIcon } from "../utils/notification";
import { Button, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { deleteSubmission } from "../apis/formSubmit";

function EditableField({ initialValue, name }) {
  const [count, setCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleEditClick = () => {
    setCount(count + 1);
    setEditing(true);
  };

  const handleUpdateClick = () => {
    setEditing(false);

    (async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const data = {
        [name]: value,
      };
      const response = await updateChurch(data, token);
      if (!response.success) {
        openNotificationWithIcon("error", "Error", response.message);
        return;
      }
      openNotificationWithIcon("success", "Success", `تم التعديل بنجاح`);
    })();
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={editing ? 'editable-cell editing' : 'editable-cell'}>
      <input
        className="editable-input"
        readOnly={!editing}
        onFocus={() => setCount(count + 1)}
        value={value}
        onChange={handleChange}
      />
      {editing ?
        <i
          className="fa fa-check-square-o edit-button"
          onClick={handleUpdateClick}
          style={{
            color: 'green',
          }}></i>
        :
        <i
          className="fa fa-pencil-square-o edit-button"
          onClick={handleEditClick}
          style={{
            color: 'black',
          }}
        ></i>
      }
    </div>
  );
}

const Church = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const [churchData, setChurchData] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [groupedSubmissions, setGroupedSubmissions] = useState([]);
  const [allSubbmissionsTotalPrice, setAllSubbmissionsTotalPrice] = useState(0);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubmition, setSelectedSubmition] = useState(null);

  useEffect(() => {
    (async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await getChurch(token);
      if (!response.success) {
        openNotificationWithIcon("error", "Error", response.message);
        return;
      }
      setChurchData(response.church);
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      const response = await getAllChurchSubbmissions(token);
      if (!response.success) {
        openNotificationWithIcon("error", "Error", response.message);
        return;
      }
      setAllSubmissions(response.submissions);
    })();
  }, [token]);

  useEffect(() => {
    let allSubbmissionsTotalPriceData = 0;
    const groupedSubmissionsData = allSubmissions.reduce((acc, submission) => {
      if (!acc[submission.formTemplateId.activityId.name]) {
        acc[submission.formTemplateId.activityId.name] = {};
      }
      if (!acc[submission.formTemplateId.activityId.name][submission.formTemplateId.name]) {
        acc[submission.formTemplateId.activityId.name][submission.formTemplateId.name] = [];
      }
      acc[submission.formTemplateId.activityId.name][submission.formTemplateId.name].push(submission);
      allSubbmissionsTotalPriceData += submission.totalPrice;
      return acc;
    }, {});
    setGroupedSubmissions(groupedSubmissionsData);
    setAllSubbmissionsTotalPrice(allSubbmissionsTotalPriceData);
  }, [allSubmissions]);

  const handelDeleteSubmition = (submissionId) => async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await deleteSubmission(submissionId, token);
    if (!response.success) {
      openNotificationWithIcon("error", "خطأ", response.message);
      return;
    } else {
      openNotificationWithIcon("success", "تم", response.message);
      window.location.reload();
    }
  }

  return (
    <>
      <Header />
      <MDBContainer className="mt-5" style={{
        marginBottom: '5rem',
      }}>
        <h1 className="text-center mt-5 mb-5">
          معلومات الكنيسة
        </h1>
        <MDBRow>
          <MDBCol dir='rtl'>
            {churchData && (
              <>
                <div style={{
                  fontSize: '1.2rem',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                  }}>
                    الاسم:
                    <EditableField initialValue={churchData.name} name="name" />
                  </div>
                  <br />
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                  }}>
                    قطاع:
                    <EditableField initialValue={churchData.address} name="address" />
                  </div>
                  <br />
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                  }}>
                    المسؤول:
                    <EditableField initialValue={churchData.responsiblePerson} name="responsiblePerson" />
                  </div>
                  <br />
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                  }}>
                    الهاتف:
                    <EditableField initialValue={churchData.phone} name="phone" />
                  </div>
                </div>
              </>
            )}
          </MDBCol>
        </MDBRow >

        <hr className="my-5" style={{
          border: '1px solid #000',
        }} />

        <MDBRow style={
          {
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            flexDirection: 'column',
          }
        }>
          {groupedSubmissions && Object.keys(groupedSubmissions).map((activityName, index) => {
            return (
              <MDBCol key={index} dir='rtl'>
                <h2>{activityName}</h2>
                {/* line */}
                <hr style={{
                  width: '80%',
                }} />
                <MDBRow
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                  }}
                >
                  {Object.keys(groupedSubmissions[activityName]).map((formName, index) => {
                    return (
                      <MDBCol key={index} dir='rtl'>
                        <h3>
                          {formName}
                          {" "}
                          <small style={{
                            color: '#005300',
                            fontSize: '1rem',
                          }}>{groupedSubmissions[activityName][formName].map(submission => submission.totalPrice).reduce((acc, price) => acc + price, 0)} جنية</small>
                        </h3>
                        <MDBRow style={{
                          display: 'flex',
                          gap: '0.8rem',
                          flexDirection: 'column',
                        }}>
                          {groupedSubmissions[activityName][formName].map((submission, index) => {
                            return (
                              <MDBCol key={index} dir='rtl'>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "1rem",
                                    width: "100%",
                                    alignItems: "center"
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: '1.1rem',
                                    }}
                                  >تم التقديم في: {new Date(submission.createdAt).toLocaleString().replace(',', '')}</span>
                                  <Button onClick={() =>
                                    navigate(`/form-submit/${submission.formTemplateId
                                      ._id}?submitionId=${submission._id}`)}
                                  >
                                    <FontAwesomeIcon icon={faPen} />
                                  </Button>
                                  {/* TODO: Add delete submition */}
                                  <Button onClick={
                                    () => {
                                      setShowDeleteModal(true);
                                      setSelectedSubmition(submission._id);
                                    }
                                  } danger>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              </MDBCol>
                            );
                          })}
                        </MDBRow>
                      </MDBCol>
                    );
                  })}
                </MDBRow>
              </MDBCol>
            );
          })}

          {allSubbmissionsTotalPrice > 0 && (
            <MDBCol dir='rtl' style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // border top and bottom
              borderTop: '1px solid #005300',
              borderBottom: '1px solid #005300',
            }}>
              <h3
                style={{
                  marginTop: '0.5rem',
                }}
              >الملغ الكلي:
                {" "}
                <span style={{
                  color: '#005300',
                }}>
                  {allSubbmissionsTotalPrice} جنية
                </span>
              </h3>
            </MDBCol>
          )}
        </MDBRow >

      </MDBContainer >
      {showDeleteModal && (
        <Modal
          open={showDeleteModal}
          footer={null}
          onCancel={() => setShowDeleteModal(false)}
          style={{
            direction: "rtl",
            textAlign: "center",
            fontFamily: "Cairo",
            fontSize: "1.5rem",
            minWidth: "fit-content",
            margin: "0 auto",
          }}
        >
          <h4>هل تريد حذف هذا التقديم ؟</h4>
          <div
            style={{
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              onClick={handelDeleteSubmition(selectedSubmition)}
              danger
            >
              نعم
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
            >
              لا
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Church;
