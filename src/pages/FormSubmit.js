import React, { useEffect, useState } from 'react';
import Header from './Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { getFormTemplate } from '../apis/formTemplate';

const FormSubmit = () => {
  const [FormTemplateId, setFormTemplateId] = useState('662eb98b0458746738a95157');
  const [formTemplateData, setFormTemplateData] = useState(null);
  const [formFieldsData, setFormFieldsData] = useState([]);

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
      console.log("🚀 ~ response:", response)
      setFormTemplateData(response);
      console.log("🚀 ~ response:", response)
      setFormFieldsData(response.fields);
    })();

  }, [FormTemplateId]);

  return (
    <>
      <Header />

      {/* 
        in formFieldsData we have (
          fields:
            name: name of the field
            description: description of the field ( indeed it as a tooltip )
            order: order of the field for sorting
            isRequired: is the field required or not
            isEnum: is the field an enum or not
              numberOfChoices (if isEnum is true): number of choices
              values (if isEnum is true): array of choices
       */}
      <h1 className="text-center">{formTemplateData?.name}</h1>
      <MDBContainer>
        <h1 className="text-center mt-5">
          استمارة {formTemplateData?.name}
        </h1>
        <MDBRow>
          <MDBCol>
            <form dir='rtl'>
              {formFieldsData.map((field, index) => (
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
                                  required={field.isRequired}
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
                              required={field.isRequired}>
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
                        />
                      </>
                    )}
                  </>
                </div>
              ))}
              <div className="d-flex justify-content-center"> {/* Added this div for centering */}
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