import React, { useEffect, useState } from 'react';
import Header from './Header';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { getFormTemplate } from '../apis/formTemplate';

const FormSubmit = () => {
  const [FormTemplateId, setFormTemplateId] = useState('660b3b92e635369dcb7a4ed5');
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
      setFormTemplateData(response);
      setFormFieldsData(response.fields);
    })();
  }, [FormTemplateId]);

  const renderFormFields = () => {
    return formFieldsData.map((field, index) => {
      if (field.isEnum) {
        return (
          <MDBRow key={index}>
            <MDBCol>
              <label htmlFor={field.name}>{field.name}</label>
              <select id={field.name} required={field.isRequired}>
                <option value="">Select an option</option>
                {field.values.map((value, valueIndex) => (
                  <option key={valueIndex} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>
        );
      } else {
        return (
          <MDBRow key={index}>
            <MDBCol>
              <label htmlFor={field.name}>{field.name}</label>
              <input
                id={field.name}
                type="text"
                required={field.isRequired}
                placeholder={field.description}
              />
            </MDBCol>
          </MDBRow>
        );
      }
    });
  };

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
      <MDBContainer>
        <MDBRow>
          <MDBCol>
            <form dir='rtl'>
              {formFieldsData.map((field, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={`field-${index}`} className="form-label">{field.name}</label>
                  <input
                    type={field.isEnum ? 'select' : 'text'}
                    className="form-control"
                    id={`field-${index}`}
                    placeholder={field.description}
                    required={field.isRequired}
                  />
                  {field.isEnum && (
                    <select className="form-select">
                      {field.values.map((value, i) => (
                        <option key={i} value={value}>{value}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default FormSubmit;