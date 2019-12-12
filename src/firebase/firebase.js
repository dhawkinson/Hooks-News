import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseConfig from './config'


class Firebase {
  constructor() {
    // Initialize Firebase
    app.initializeApp(firebaseConfig)
    this.auth = app.auth()
    this.db = app.firestore()
  }

  // register a new user -- methods return promise, using async/await
  async register(name, email, password) {
    // create the user with email and password (firebase auth method)
    const newUser = await this.auth.createUserWithEmailAndPassword(email, password)
    // update name to new user (firebase auth method)
    return await newUser.user.updateProfile({
      displayName: name
    })
  }

  // login a user -- method returns promise, using async/await
  async login(email, password) {
    // login the user with email and password (firebase auth method)
    return await this.auth.signInWithEmailAndPassword(email, password)
  }

  // logout a user -- method returns promise, using async/await
  async logout() {
    // logout (firebase auth method)
    await this.auth.signOut()
  }

  // reset password -- method returns promise, using async/await
  async resetPassword(email) {
    // send resetPasswordEmail (firebase auth method)
    await this.auth.sendPasswordResetEmail(email)
  }
}

// instantiate firebase auth
const firebase = new Firebase()
export default firebase
