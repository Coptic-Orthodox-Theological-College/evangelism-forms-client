import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { getFormTemplate } from '../apis/formTemplate';
import { openNotificationWithIcon } from '../utils/notification';
import { deleteSubmission, getOneSubmission, submitForm, updateSubmission } from '../apis/formSubmit';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [numberOfSubFields, setNumberOfSubFields] = useState([])

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

  const handleNumberFieldChange = (e, fieldId, field) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);

    if (!isNaN(numericValue)) {
      if (numericValue < 0) {
        openNotificationWithIcon('error', 'خطأ', 'الرقم يجب أن يكون أكبر من 0');
        e.target.value = 0;
        return;
      }

      if (numericValue > field.ifNumber.maxNumber) {
        openNotificationWithIcon('error', 'خطأ', `الرقم يجب أن يكون أقل من ${field.ifNumber.maxNumber}`);
        e.target.value = field.ifNumber.maxNumber;
        return;
      }

      const existingNumberData = formSubmitData.find((item) => item.fieldId === fieldId);
      if (existingNumberData) {
        setFormSubmitData((prevData) => [
          ...prevData.filter((item) => item.fieldId !== fieldId),
          {
            fieldId,
            value: `${numericValue}`,
          },
        ]);
      } else {
        setFormSubmitData((prevData) => [
          ...prevData,
          {
            fieldId,
            value: `${numericValue}`,
          },
        ]);
      }
    } else {
      e.target.value = '';
    }
  };

  const handleSubNumberFieldChange = (e, fieldId, index, teamIndex) => {
    const value = e.target.value;
    const existingData = formSubmitData.find((item) => item.fieldId === fieldId);

    if (existingData) {
      let indexValue = `${teamIndex + 1}.${index + 1}:`;
      let newValue = `${teamIndex + 1}.${index + 1}:${value}`;
      const indexValueExists = existingData.value.split(',').find((item) => item.includes(indexValue)) ? true : false;

      if (indexValueExists) {
        const oldValue = existingData.value.split(',').find((item) => item.includes(indexValue));
        const updatedValue = existingData.value.replace(oldValue, newValue);
        setFormSubmitData((prevData) => [
          ...prevData.filter((item) => item.fieldId !== fieldId),
          {
            fieldId,
            value: updatedValue,
          },
        ]);
      } else {
        setFormSubmitData((prevData) => [
          ...prevData.filter((item) => item.fieldId !== fieldId),
          {
            fieldId,
            value: `${existingData.value},${newValue}`,
          },
        ]);
      }
    }
  };

  const handleAddSubNumberField = (teamIndex, minRequiredNames, maxRequiredNames, fieldId) => {
    const existingData = numberOfSubFields.find((item) => {
      if (item.teamIndex === teamIndex && item.fieldId === fieldId) {
        return item;
      }
    });

    if (existingData) {
      if (existingData.value >= maxRequiredNames) {
        openNotificationWithIcon('error', 'خطأ', `لا يمكنك إضافة المزيد من الأسماء`);
        return;
      }

      const updatedData = numberOfSubFields.map((item) => {
        if (item.teamIndex === teamIndex && item.fieldId === fieldId) {
          return {
            fieldId,
            teamIndex,
            value: existingData.value + 1,
          };
        }
        return item;
      });

      setNumberOfSubFields(updatedData);
    } else {
      setNumberOfSubFields((prevData) => [
        ...prevData,
        {
          fieldId,
          teamIndex,
          value: minRequiredNames + 1,
        },
      ]);
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
      navigate('/church');
    } else {
      openNotificationWithIcon('error', 'خطأ', response.message);
      return;
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const response = await updateSubmission(submitionId, formSubmmitedData.data, token);
    if (response.success) {
      openNotificationWithIcon('success', 'نجاح', 'تم تعديل النموذج بنجاح');
      setIsEditing(false);
    } else {
      openNotificationWithIcon('error', 'خطأ', response.message);
    }
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
      <MDBContainer style={{
        marginBottom: '5rem',
      }}>
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
                          <button
                            className="btn btn-primary me-2"
                            onClick={handleEdit}
                          >
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
                          <label htmlFor={`field-${`index`}`} className="form-label">
                            {field.name}
                            {field.ifNumber?.price && (<small> {field.ifNumber.price}{"x"} جنية</small>)}
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
                                {field.isNumber ? (
                                  <>
                                    <div style={{
                                      display: 'flex',
                                      gap: '2rem',
                                      alignItems: 'center',
                                    }}>
                                      <input
                                        type="number"
                                        className="form-control"
                                        id={`field-${index}`}
                                        placeholder={field.description}
                                        required={field.isRequired}
                                        style={{
                                          width: 'fit-content',
                                        }}
                                        onChange={(e) => {
                                          handleNumberFieldChange(e, field._id, field);
                                        }}
                                        // not editubule if the number is more than maxNumber and if user type if the number is more than maxNumber it will not be saved
                                        max={field.ifNumber.maxNumber}
                                      />
                                      <div style={{
                                        color: "#005300",
                                      }}>
                                        {field.ifNumber.price && (
                                          <>
                                            {formSubmitData.find((item) => item.fieldId === field._id)?.value.split(',')[0] ?
                                              field.ifNumber.price * formSubmitData.find((item) => item.fieldId === field._id)?.value.split(',')[0] : 0
                                            } جنيه
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {field.ifNumber.maxRequiredNames !== 0 &&
                                      formSubmitData
                                        .find((item) => item.fieldId === field._id)
                                        ?.value.split(',')[0] > 0 && (
                                        <>
                                          {Array.from(
                                            Array(
                                              parseInt(
                                                formSubmitData.find((item) => item.fieldId === field._id)?.value
                                                  .split(',')[0],
                                                10
                                              )
                                            ),
                                            (_, teamIndex) => (
                                              <div key={teamIndex} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '1rem',
                                                margin: '1rem',
                                              }}>
                                                <h5>{field.ifNumber.nameTitle} {teamIndex + 1}</h5>
                                                <div
                                                  style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center',
                                                    alignContent: 'center',
                                                    gap: '2rem',
                                                    justifyContent: 'flex-start',
                                                  }}
                                                >
                                                  {Array.from(
                                                    Array(
                                                      (numberOfSubFields.find((item) => item.teamIndex === teamIndex
                                                        && item.fieldId === field._id
                                                      )?.value)
                                                      ||
                                                      field.ifNumber.minRequiredNames
                                                    ),
                                                    (_, i) => (
                                                      <div key={i}>
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                          placeholder=
                                                          {
                                                            (
                                                              (numberOfSubFields.find((item) => item.teamIndex === teamIndex
                                                                && item.fieldId === field._id
                                                              )?.value)
                                                              ||
                                                              field.ifNumber.minRequiredNames) > 1 ? (`ادخل اسم ${i + 1}`) : (`ادخل الاسم`)
                                                          }
                                                          value={
                                                            formSubmitData.find((item) => item.fieldId === field._id)
                                                              ?.value.split(',')
                                                              .find((item) => item.includes(`${teamIndex + 1}.${i + 1}:`))
                                                              ?.split(':')[1] || ''
                                                          }
                                                          onChange={(e) =>
                                                            handleSubNumberFieldChange(
                                                              e,
                                                              field._id,
                                                              i,
                                                              teamIndex
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                                {(
                                                  (
                                                    numberOfSubFields.find((item) => item.teamIndex === teamIndex &&
                                                      item.fieldId === field._id)?.value ||
                                                    field.ifNumber.minRequiredNames
                                                  ) < field.ifNumber.maxRequiredNames ? (
                                                    <Button
                                                      onClick={() =>
                                                        handleAddSubNumberField(
                                                          teamIndex,
                                                          field.ifNumber.minRequiredNames,
                                                          field.ifNumber.maxRequiredNames,
                                                          field._id
                                                        )}
                                                      style={{
                                                        backgroundColor: '#004d00',
                                                        color: 'white',
                                                        width: '150px',
                                                      }}
                                                    >
                                                      <FontAwesomeIcon icon={faAdd} />
                                                    </Button>
                                                  ) : null)}
                                              </div>
                                            )
                                          )}
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
                            )}
                          </>
                        </div>
                      ))}
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-primary mt-5">حفظ</button>
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
      </MDBContainer >
    </>
  );
};

export default FormSubmit;