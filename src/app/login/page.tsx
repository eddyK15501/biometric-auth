'use client'
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { useRouter } from 'next/navigation'
import * as SimpleWebAuthnBrowser from '@simplewebauthn/browser'

export default function Login() {
  const { handleDeviceAuthentication, login, user } = useAuth()
  const [email, setEmail] = useState('')
  const router = useRouter()
  const passwordRef = useRef<HTMLInputElement>(null)
  const [browserSupportWebAuthn, setBrowserSupportWebAuthn] = useState(false)
  const e = email

  useEffect(() => {
    if (SimpleWebAuthnBrowser.browserSupportsWebAuthn()) {
      setBrowserSupportWebAuthn(true)
      handleDeviceAuthentication(email as string, true).then(
        (isSuccessful) => isSuccessful && router.replace('profile')
      )
    }
  }, [])

  const goToProfilePage = (isSuccessful: boolean) => {
    isSuccessful && router.replace('profile')
  }

  const handleLoginPasskey: FormEventHandler<HTMLFormElement> = (
    e: FormEvent
  ) => {
    e.preventDefault()
    if (!email) return
    return handleDeviceAuthentication(email).then(goToProfilePage)
  }

  const handleLoginBasic: FormEventHandler<HTMLFormElement> = (
    e: FormEvent
  ) => {
    e.preventDefault()
    if (passwordRef?.current && email) {
      const password = passwordRef.current?.value || ''
      return login(email, password).then(goToProfilePage)
    }
  }

  return (
    <form
      onSubmit={browserSupportWebAuthn ? handleLoginPasskey : handleLoginBasic}
    >
      <div className="grid_txt_1">
        <h1 className="u-center">Login</h1>
        <div className="grid_txt">
          <label htmlFor="">email</label>
          <input
            value={email}
            type="text"
            placeholder="enter your email"
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        {browserSupportWebAuthn ? (
          <></>
        ) : (
          <div className="grid_txt">
            <label htmlFor="">password</label>
            <input
              type="password"
              ref={passwordRef}
              placeholder="enter your password"
            />
          </div>
        )}
        <button className="btn">login</button>
      </div>
    </form>
  )
}
