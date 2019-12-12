import React from "react";
import { withRouter, NavLink } from 'react-router-dom'

import { FirebaseContext } from '../firebase'

function Header() {
const { user, firebase } = React.useContext(FirebaseContext)

  return (
    <div className="header">
      <div className="flex">
        <img src="/logo.png" alt="Hooks News Logo" className="logo" />
        <NavLink to="/" className="header-title">
          Hooks News
        </NavLink>
        <NavLink to="/" className="header-link">
          new
        </NavLink>
        <div>|</div>
        <NavLink to="/top" className="header-link">
          top
        </NavLink>
        <div>|</div>
        <NavLink to="/search" className="header-link">
          search
        </NavLink>
          {/* conditional logic to only show submit link with logged in user */}
          {user && (
          <>
          <div className='divider'>|</div>
          <NavLink to="/create" className="header-link">
            submit
          </NavLink>
          </>
          )}
      </div>
      <div className="flex">
        {/* conditional logic to display user|Logout or Login using ternary command */}
        {user ? (
          <>
            <div className='header-name'>{user.displayName}</div>
            <div className='divider'>|</div>
            <div className='header-button' onClick={() => firebase.logout()}>Logout</div>
          </>
        ) : (<NavLink to="/login" className="header-link">
          Login
        </NavLink>)}

      </div>
    </div>
  )
}

export default withRouter(Header);
