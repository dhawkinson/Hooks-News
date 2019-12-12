import React from "react";

function useFormValidation(initialState, validate, authenticate) {
  // initialize state & setters
  const [values, setValues] = React.useState(initialState)
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isSubmitting) {
      // no errors = 0 length
      const noErrors = Object.keys(errors).length === 0
      if (noErrors) {
        // update user file
        authenticate()
        setSubmitting(false)
      } else {
        setSubmitting(false)
      }
    }
  }, [authenticate, errors, isSubmitting, values])

  // test for change to any of the values
  const handleChange = (event) => {
    // persist the value
    event.persist()
    // set changed value by name
    setValues(previousValues => ({
      ...previousValues,
      [event.target.name]: event.target.value
    }))
  }

  // test for moved away from form field
  const handleBlur = () => {
    const validationErrors = validate(values)
    setErrors(validationErrors)
  }

  // test for form submission
  const handleSubmit = (event) => {
    event.preventDefault() // prevent form reload
    const validationErrors = validate(values)
    setErrors(validationErrors)
    setSubmitting(true)
  }
  // make these available to login
  return {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    isSubmitting
  }
}

export default useFormValidation;