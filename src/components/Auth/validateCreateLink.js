export default function validateCreateLink(values) {
  let errors = {}

  // description errors
  if (!values.description) {
    // no entry made
    errors.description = "Description required"
  } else if (values.description.length < 10) {
    // entry too short
    errors.description = "Description must be at least 10 characters long"
  }
  // url errors
  if (!values.url) {
    // no entry made
    errors.url = "URL required"
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    // entry too short
    errors.url = "URL not valid"
  }

  return errors
}