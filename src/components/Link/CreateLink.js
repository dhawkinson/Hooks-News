import React from 'react'

import useFormValidation from '../Auth/useFormValidation'
import validateCreateLink from '../Auth/validateCreateLink'
import FirebaseContext from '../../firebase/context'

const INITIAL_STATE = {
  description: '',
  url: ''
}

function CreateLink(props) {
  const { firebase, user } = React.useContext(FirebaseContext)
  const { handleSubmit, handleChange, values, errors } = useFormValidation(INITIAL_STATE, validateCreateLink, handleCreateLink)

  function handleCreateLink(){
    if ( !user ) {
      // user not authenticated - route to login
      props.history.push('/login')
    } else {
      // user authenticated - allow document creation
      // *** the following block is a standard firebase create pattern ***
      const { url, description } = values
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      }
      firebase.db.collection('links').add(newLink)
      // route back to home page
      props.history.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-column mt3'>
      <input
        onChange={handleChange}
        value={values.description}
        name='description'
        placeholder='A description for your link'
        autoComplete='off'
        type='text'
        className={errors.description && 'error-input'}
      />
      { errors.description && <p className='error-text'>{errors.description}</p> }
      <input
        onChange={handleChange}
        value={values.url}
        name='url'
        placeholder='The URL for your link'
        autoComplete='off'
        type='url'
        className={errors.url && 'error-input'}
      />
      { errors.url && <p className='error-text'>{errors.url}</p> }
      <button className='button' type='submit'>
        Submit
      </button>
    </form>
  )
}

export default CreateLink