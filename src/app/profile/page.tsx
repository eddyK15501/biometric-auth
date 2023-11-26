'use client'
import { useAuth } from '../AuthProvider'

export default function Profile() {
  const { user, signOut } = useAuth()
  return (
    <div className="App grid_txt_1">
      <h1>
        congrats! logged in as <span className="col-gold">{user?.email}</span>{' '}
      </h1>
      <div className="u-center">
        <button className="btn br" onClick={signOut}>
          sign out
        </button>
      </div>
    </div>
  )
}
