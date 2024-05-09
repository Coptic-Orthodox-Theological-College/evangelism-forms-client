import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { getChurch } from "../apis/church";
import { openNotificationWithIcon } from "../utils/notification";

function EditableField({ initialValue }) {
  const [count, setCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleEditClick = () => {
    setCount(count + 1);
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
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
        onBlur={handleBlur}
        value={value}
        onChange={handleChange}
      />
      {/* <button
        className={count < 2 ? 'edit-button hide' : 'edit-button'}
        onClick={handleEditClick}
      >
        Edit
      </button> */}
      <i className="fa fa-pencil-square-o edit-button" onClick={handleEditClick}></i>
    </div>
  );
}

const Church = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const [churchData, setChurchData] = useState(null);

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
      console.log(response);
      setChurchData(response.church);
    })();
  }, [token]);

  return (
    <>
      <Header />
      <MDBContainer className="mt-5">
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
                    <EditableField initialValue={churchData.name} />
                  </div>
                  <br />
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                  }}>
                    قطاع:
                    <EditableField initialValue={churchData.address} />
                  </div>
                </div>
              </>
            )}
          </MDBCol>
        </MDBRow >
      </MDBContainer >
    </>
  );
};

export default Church;
