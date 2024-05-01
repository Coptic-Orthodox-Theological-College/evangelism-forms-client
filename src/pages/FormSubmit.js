import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { getFormTemplate } from '../apis/formTemplate';
import { openNotificationWithIcon } from '../utils/notification';

const FormSubmit = () => {
  const FormTemplateId = window.location.pathname.split("/")[2];
  const [formTemplateData, setFormTemplateData] = useState(null);
  const [formFieldsData, setFormFieldsData] = useState([]);
  const [formSubmitData, setFormSubmitData] = useState([]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
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

  const handleInputChange = (e, fieldId) => {
    const newObject = {
      fieldId,
      value: e.target.value
    };
    setFormSubmitData((prevData) => [...prevData.filter(item => item.fieldId !== fieldId), newObject]);
  };

  // TODO: we need to update numberOfChoices to (maxNumberOfChoices) and (minNumberOfChoices) to handle the case of multiple choices
  const handleCheckboxChange = (e, fieldId, numberOfChoices) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const formValues = {};

    // for (let [key, value] of formData.entries()) {
    //   formValues[key] = value;
    // }

    // setFormSubmitData(formValues);
    console.log("🚀 ~ handleSubmit ~ formSubmitData:", formSubmitData)
    return;
  }

  return (
    <>
      <Header />
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
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default FormSubmit;