import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { openNotificationWithIcon } from "../utils/notification";
import { listActivities } from "../apis/activities";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const [churchData, setChurchData] = useState({});
  const [allActivities, setAllActivities] = useState([]);
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
      const response = await listActivities();
      if (!response.success) {
        openNotificationWithIcon("error", "خطأ", response.message);
        return;
      }
      setAllActivities(response.activities);
    })();
  }, []);

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
                {allActivities.map((activity, index) => (
                  <MDBCol key={index}>
                    <div className="sub-titlebaground" onClick={() => navigate(`/form-templates/${activity._id}`)}>
                      <div style={{ color: "white", fontSize: "1.5em", textDecoration: 'none' }}>
                        {activity.name}
                        <br />
                        <p style={{ fontSize: "0.5em" }}>{activity.description}</p>
                      </div>
                    </div>
                  </MDBCol>
                ))}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer >
      </div >
    </>
  );
};

export default Activities;
