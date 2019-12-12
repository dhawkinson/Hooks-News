import React from "react"
import { Link } from 'react-router-dom'

import useFormValidation from './useFormValidation'
import validateLogin from './validateLogin'
import firebase from '../../firebase'

const INITIAL_STATE = {
  name: "",
  email: "",
  password: ""
}

function Login(props) {
  // initialize state
  const { 
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    isSubmitting 
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser)
  // initialize state
  const [login, setLogin] = React.useState(true)
  const [firebaseError, setFirebaseError] = React.useState(null)

  // authenticate user by either registering or logging in
  // do not use => function or authenticateUser (line 22) is errored out with "use before declare"
  async function authenticateUser() {
    const { name, email, password } = values
    try {
      login
        // login
        ? await firebase.login(email, password)
        //  register
        : await firebase.register(name, email, password)
      // redirect to home page on successful login
      props.history.push('/')
    } catch (err) {
      console.error("Authentication Error", err)
      setFirebaseError(err.message)
    }
  }

  // return the input form
  //    toggle heading on test for login or register
  //    toggle entry of name on test for login or register
  //    validate email and password
  //    toggle Submit button color on test for submitting or not
  //    toggle pointer button on test for login or register
  return (
    <div>
      <h2 className="mv3">{ login ? "Login" : "Register Account"}</h2>
      <form onSubmit={ handleSubmit } className="flex flex-column">
        { !login && (
          <input
          onChange={ handleChange }
          value={values.name}
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="off"
        />)}
        <input
          onChange={ handleChange }
          onBlur={handleBlur}
          value={values.email}
          name="email"
          type="email"
          className={errors.email && 'error-input'}
          placeholder="Your email"
          autoComplete="off"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          onChange={ handleChange }
          onBlur={handleBlur}
          value={values.password}
          name="password"
          type="password"
          className={errors.password && 'error-input'}
          placeholder="Choose a secure password"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button 
            type="submit" 
            className="button pointer mr2" 
            disabled={isSubmitting}
            style={{ background: isSubmitting ? "grey" : "orange" }}
          >
            Submit
          </button>
          <button 
            type="button" 
            className="button pointer" 
            onClick={ () => setLogin( prevLogin => !prevLogin ) }
          >
            { login ? "Need to register an account?" : "Already have an account?"}
          </button>
        </div>
      </form>
      <div className='forgot-password'>
        <Link to='/forgot'>Forgot password?</Link>
      </div>
    </div>
  )
}

export default Login;
