import React from 'react'
import firebase from '../../firebase'

function useAuth() {
  const [authUser, setAuthUser] = React.useState(null)

  React.useEffect(() => {
    // execute state changed listener (determines if we have authUser or not)
    const unsubscribe = firebase.auth.onAuthStateChanged(user => {
      // test for auth user and if auth user, pass user else pass null
      if ( user ) {
        setAuthUser(user)
      } else {
        setAuthUser(null)
      }
    })
    // listener executed, now unsubscribe to prevent repeated execution
    return () => unsubscribe()
  }, [])
  // return authUser as user or null -- it is now available throughout the app
  return authUser
}

export default useAuth;