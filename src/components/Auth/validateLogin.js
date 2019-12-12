export default function validateLogin(values) {
  let errors = {}

  // email errors
  if ( !values.email ) {
    // no entry made
    errors.email = "Email required"
  } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email) ) {
    // invalid format
    errors.email = "Invalid email address"
  }
  // password errors
  if ( !values.password ) {
    // no entry made
    errors.password = "Password required"
  } else if ( values.password.length < 6 ) {
    // entry too short
    errors.password = "Password must be at least 6 characters long"
  }

  return errors
}