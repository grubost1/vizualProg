// src/components/AddForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AddForm.css'; // Create this CSS file for styling

const AddForm = ({ initialValues, validationSchema, onSubmit, fieldsConfig }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        onSubmit(values); // Call the handler passed from the parent page
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="add-form">
          <h3>Add New Item</h3>
          {fieldsConfig.map(({ name, label, type = 'text', placeholder }) => (
            <div key={name} className="form-group">
              <label htmlFor={name}>{label}</label>
              <Field
                type={type}
                name={name}
                id={name}
                placeholder={placeholder || label}
                className={`form-control ${touched[name] && errors[name] ? 'is-invalid' : ''}`}
                // Use 'checkbox' type specifically if needed
                {...(type === 'checkbox' ? { as: undefined, className: 'form-check-input' } : { as: 'input' })}
                 // Handle 'textarea' type
                {...(type === 'textarea' ? { as: 'textarea', rows: 3 } : {})}
              />
              <ErrorMessage name={name} component="div" className="invalid-feedback" />
            </div>
          ))}
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddForm; 