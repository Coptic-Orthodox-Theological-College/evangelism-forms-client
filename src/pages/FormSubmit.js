import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { getFormTemplate } from '../apis/formTemplate';
import { openNotificationWithIcon } from '../utils/notification';
import { deleteSubmission, getOneSubmission, submitForm } from '../apis/formSubmit';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';

const FormSubmit = () => {
  const navigate = useNavigate();
  const FormTemplateId = window.location.pathname.split("/")[2];
  const [formTemplateData, setFormTemplateData] = useState(null);
  const [formFieldsData, setFormFieldsData] = useState([]);
  const [formSubmitData, setFormSubmitData] = useState([]);
  const [token, setToken] = useState('');
  const [churchData, setChurchData] = useState({});
  const submitionId = new URLSearchParams(window.location.search).get('submitionId');
  const [formSubmmitedData, setFormSubmmitedData] = useState({});
  const [formSubmmitedDataTemp, setFormSubmmitedDataTemp] = useState({});
  const [submmitedAlready, setSubmmitedAlready] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    (async () => {
      const tokenExists = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!tokenExists) {
        window.location.href = '/';
      } else {
        setToken(tokenExists);
        setChurchData(JSON.parse(localStorage.getItem("church")));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await getFormTemplate(FormTemplateId);
      setFormTemplateData(response);
      setFormFieldsData(response.fields);
    })();
  }, [FormTemplateId]);

  useEffect(() => {
    async function getSubmission() {
      if (submitionId) {
        const tokenExists = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await getOneSubmission(submitionId, tokenExists);
        if (response.success) {
          setFormSubmmitedData(response.submission);
          setFormSubmmitedDataTemp(response.submission);
          setSubmmitedAlready(true);
        } else {
          openNotificationWithIcon('error', 'خطأ', response.message);
        }
      }
    }
    getSubmission();
  }, [submitionId]);

  const handleInputChange = (e, fieldId) => {
    const newObject = {
      fieldId,
      value: e.target.value
    };
    console.log("🚀 ~ handleInputChange ~ newObject:", newObject)
    if (submmitedAlready) {
      const fieldIndex = formSubmmitedData.data.findIndex(item => item.fieldId === fieldId);
      if (fieldIndex === -1) {
        setFormSubmmitedData((prevData) => ({
          ...prevData,
          data: [...prevData.data, newObject]
        }));
      } else {
        setFormSubmmitedData((prevData) => ({
          ...prevData,
          data: [
            ...prevData.data.filter(item => item.fieldId !== fieldId),
            newObject
          ]
        }));
      }
    } else {
      setFormSubmitData((prevData) => [...prevData.filter(item => item.fieldId !== fieldId), newObject]);
    }
  };
  // TODO: we need to update numberOfChoices to (maxNumberOfChoices) and (minNumberOfChoices) to handle the case of multiple choices
  const handleCheckboxChange = (e, fieldId, numberOfChoices) => {
    if (submmitedAlready) {
      const isChecked = e.target.checked;
      const fieldValue = e.target.value;
      const fieldIndex = formSubmmitedData.data.findIndex(item => item.fieldId === fieldId);
      if (isChecked) {
        if (fieldIndex === -1) {
          const newObject = {
            fieldId,
            value: fieldValue
          };
          setFormSubmmitedData((prevData) => ({
            ...prevData,
            data: [...prevData.data, newObject]
          }));
        } else {
          const fieldValues = formSubmmitedData.data[fieldIndex].value.split(",");
          if (fieldValues.length < numberOfChoices) {
            fieldValues.push(fieldValue);
            const newObject = {
              fieldId,
              value: fieldValues.join(",")
            };
            setFormSubmmitedData((prevData) => ({
              ...prevData,
              data: [
                ...prevData.data.filter(item => item.fieldId !== fieldId),
                newObject
              ]
            }));
          } else {
            openNotificationWithIcon('error', 'خطأ', `يجب اختيار ${numberOfChoices} فقط`);
            e.target.checked = false;
          }
        }
      } else {
        if (fieldIndex !== -1) {
          const fieldValues = formSubmmitedData.data[fieldIndex].value
            .split(",")
            .filter(value => value !== fieldValue);
          if (fieldValues.length === 0) {
            setFormSubmmitedData((prevData) => ({
              ...prevData,
              data: prevData.data.filter(item => item.fieldId !== fieldId)
            }));
          } else {
            const newObject = {
              fieldId,
              value: fieldValues.join(",")
            };
            setFormSubmmitedData((prevData) => ({
              ...prevData,
              data: [
                ...prevData.data.filter(item => item.fieldId !== fieldId),
                newObject
              ]
            }));
          }
        }
      }
    }
    else {
      const isChecked = e.target.checked;
      const fieldValue = e.target.value;

      // Find if the fieldId exists in formSubmitData
      const fieldIndex = formSubmitData.findIndex(item => item.fieldId === fieldId);

      // If the checkbox is checked
      if (isChecked) {
        if (fieldIndex === -1) {
          // If the fieldId doesn't exist, add it to formSubmitData with the new value
          const newObject = {
            fieldId,
            value: fieldValue
          };
          setFormSubmitData(prevData => [...prevData, newObject]);
        } else {
          // If the fieldId exists, update its value with the new checked value
          const fieldValues = formSubmitData[fieldIndex].value.split(",");
          if (fieldValues.length < numberOfChoices) {
            fieldValues.push(fieldValue);
            const newObject = {
              fieldId,
              value: fieldValues.join(",")
            };
            setFormSubmitData(prevData => [
              ...prevData.filter(item => item.fieldId !== fieldId),
              newObject
            ]);
          } else {
            openNotificationWithIcon('error', 'خطأ', `يجب اختيار ${numberOfChoices} فقط`);
            // Optionally, you can also uncheck the checkbox here to prevent more selections
            e.target.checked = false;
          }
        }
      } else {
        // If the checkbox is unchecked
        if (fieldIndex !== -1) {
          // If the fieldId exists, remove the unchecked value from its value
          const fieldValues = formSubmitData[fieldIndex].value
            .split(",")
            .filter(value => value !== fieldValue);
          if (fieldValues.length === 0) {
            // If no more values are selected, remove the fieldId from formSubmitData
            setFormSubmitData(prevData =>
              prevData.filter(item => item.fieldId !== fieldId)
            );
          } else {
            // Update the value of the fieldId without the unchecked value
            const newObject = {
              fieldId,
              value: fieldValues.join(",")
            };
            setFormSubmitData(prevData => [
              ...prevData.filter(item => item.fieldId !== fieldId),
              newObject
            ]);
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitForm(formSubmitData, FormTemplateId, token);
    if (response.success) {
      openNotificationWithIcon('success', 'نجاح', 'تم تقديم النموذج بنجاح');
    } else {
      openNotificationWithIcon('error', 'خطأ', response.message);
    }
    navigate('/');
  }

  const handleEdit = async (e) => {
  }

  const handleDelete = async () => {
    const response = await deleteSubmission(submitionId, token);

    if (response.success) {
      openNotificationWithIcon('success', 'نجاح', 'تم حذف النموذج بنجاح');
      navigate('/');
    } else {
      openNotificationWithIcon('error', 'خطأ', response.message);
    }
  }

  return (
    <>
      <Header churchData={churchData} />
      {/* 
        formFieldsData
          fields:
            name: name of the field
            description: description of the field ( indeed it as a tooltip )
            order: order of the field for sorting
            isRequired: is the field required or not
            isEnum: is the field an enum or not
              numberOfChoices (if isEnum is true): number of choices
              values (if isEnum is true): array of choices
       */}
      <MDBContainer>
        <h1 className="text-center mt-5">
          استمارة {formTemplateData?.name}
        </h1>
        <MDBRow>
          <MDBCol>
            {submmitedAlready ?
              (
                <>
                  {/* here i need to show same inputs with same fields but with values and 2 buttons one for edit and one for delete
                    formSubmmitedData.data -> value and fieldId
                  */}
                  {/* start */}
                  <div dir="rtl" className="mt-5">
                    {formFieldsData
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((field, index) => (
                        <div key={index} className="mb-3">
                          <label htmlFor={`field-${index}`} className="form-label">
                            {field.name}
                          </label>
                          <>
                            {field.isEnum ? (
                              <>
                                {field.numberOfChoices > 1 ? (
                                  <>
                                    {field.values.map((value, valueIndex) => (
                                      <div key={valueIndex} className="form-check form-check-inline">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          name={`field-${index}-${valueIndex}`}
                                          id={`field-${index}-${valueIndex}`}
                                          value={value}
                                          checked={
                                            formSubmmitedData.data
                                              .filter((item) => item.fieldId === field._id)
                                              .some((item) => item.value.split(',').includes(value))}
                                          onChange={(e) => {
                                            if (isEditing) {
                                              handleCheckboxChange(e, field._id, field.numberOfChoices);
                                            }
                                          }}
                                          disabled={!isEditing}
                                        />
                                        <label className="form-check-label" htmlFor={`field-${index}-${valueIndex}`}>
                                          {value}
                                        </label>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <select
                                      className="form-select"
                                      id={`field-${index}`}
                                      required={field.isRequired}
                                      value={
                                        formSubmmitedData.data.find((item) => item.fieldId === field._id)?.value || ''
                                      }
                                      onChange={(e) => {
                                        if (isEditing) {
                                          handleInputChange(e, field._id);
                                        }
                                      }}
                                      disabled={!isEditing}
                                    >
                                      <option value="">Select an option</option>
                                      {field.values.map((value, valueIndex) => (
                                        <option key={valueIndex} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  id={`field-${index}`}
                                  placeholder={field.description}
                                  required={field.isRequired}
                                  value={
                                    formSubmmitedData.data.find((item) => item.fieldId === field._id)?.value || ''
                                  }
                                  onChange={(e) => {
                                    if (isEditing) {
                                      handleInputChange(e, field._id);
                                    }
                                  }}
                                  disabled={!isEditing}
                                />
                              </>
                            )}
                          </>
                        </div>
                      ))}
                    <div className="d-flex justify-content-center">
                      {isEditing ? (
                        <div
                          style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
                        >
                          <button type="submit" className="btn btn-primary me-2">
                            حفظ
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setIsEditing(false)
                              setFormSubmmitedData(formSubmmitedDataTemp)
                            }}
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
                        >
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => setIsEditing(true)}
                          >
                            تعديل
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger ms-2"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            حذف
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* end */}
                </>
              ) : (
                <>
                  {/* i dont need form to go anyware i wll handle it  */}
                  <form dir='rtl' onSubmit={handleSubmit} className="mt-5">
                    {formFieldsData
                      .slice() // create a shallow copy to avoid mutating the original array
                      .sort((a, b) => a.order - b.order) // sort by order
                      .map((field, index) => (
                        <div key={index} className="mb-3">
                          <label htmlFor={`field-${`index`}`} className="form-label">{field.name}</label>
                          <>
                            {field.isEnum ? (
                              <>
                                {field.numberOfChoices > 1 ? (
                                  <>
                                    {field.values.map((value, valueIndex) => (
                                      <div key={valueIndex} className="form-check form-check-inline">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          name={`field-${index}-${valueIndex}`}
                                          id={`field-${index}-${valueIndex}`}
                                          value={value}
                                          onChange={(e) => {
                                            handleCheckboxChange(e, field._id, field.numberOfChoices);
                                          }}
                                        />
                                        <label className="form-check-label" htmlFor={`field-${index}-${valueIndex}`}>{value}</label>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <select
                                      className="form-select"
                                      id={`field-${index}`}
                                      required={field.isRequired}
                                      onChange={(e) => {
                                        handleInputChange(e, field._id);
                                      }}
                                    >
                                      <option value="">Select an option</option>
                                      {field.values.map((value, valueIndex) => (
                                        <option key={valueIndex} value={value}>
                                          {value}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <input
                                  type='text'
                                  className="form-control"
                                  id={`field-${index}`}
                                  placeholder={field.description}
                                  required={field.isRequired}
                                  onChange={(e) => {
                                    handleInputChange(e, field._id);
                                  }}
                                />
                              </>
                            )}
                          </>
                        </div>
                      ))}
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </form>
                </>
              )}
          </MDBCol>
        </MDBRow>
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
                onClick={handleDelete}
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
      </MDBContainer>
    </>
  );
};

export default FormSubmit;