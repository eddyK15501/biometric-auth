'use client'
import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from 'react'
import { AuthContextType, authStatus, User } from '.'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import * as SimpleWebAuthnBrowser from '@simplewebauthn/browser'

const initialState: AuthContextType = {
  status: 'loading',
  user: {
    email: '',
  },
  async handleDeviceRegistration(username?: string) {
    return false
  },
  async handleDeviceAuthentication(email: string) {
    return false
  },
  async signup(email: string, password: string) {
    console.log('signup initial function is called...')
    try {
      const { data } = await axios.post('/api/signup', {
        email,
        password,
      })
    } catch (error) {
      console.log(error)
    }
  },
  async login(email: string, password: string) {
    return false
  },
  signOut() {},
}

const AuthCtx = createContext<AuthContextType>(initialState)
export const useAuth = () => useContext(AuthCtx)

const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [status, setStatus] = useState<authStatus>('loading')
  const [user, setUser] = useState<User | null>(null)

  const router = useRouter()

  const signup = async (email: string, password: string) => {
    console.log('signup function in auth provider called.......')
    try {
      const { data } = await axios.post('/api/signup', {
        email,
        password,
      })
    } catch (error) {
      console.log(error)
    }
    setUser({ email })
    router.push('register-device')
  }
  const login = async (email: string, password: string) => {
    return false
  }

  const handleDeviceRegistration = async (username?: string) => {
    console.log('Handle device registration...')
    console.log('user: ', user)

    const email = user?.email || ''
    try {
      const { data: credentialCreationOptions } = await axios.post(
        '/api/webauthn/get-register-device-options',
        {
          email,
        }
      )
      console.log('credential data: ', credentialCreationOptions)
      const attestationResponse = await SimpleWebAuthnBrowser.startRegistration(
        credentialCreationOptions
      )
      console.log('attestationResponse: ', attestationResponse)
      await axios.post('/api/webauthn/verify-reg-device', {
        email,
        data: attestationResponse,
      })
    } catch (error) {
      alert('oopsie!! an error occured during registration')
      return false
    }
    return true
  }

  const handleDeviceAuthentication = async (
    email: string,
    useBrowserAutofill = false
  ) => {
    try {
      const { data } = await axios.post(
        '/api/webauthn/get-authentication-options',
        {
          email,
        }
      )
      console.log('auth response: ', data)
      const assertionResponse = await SimpleWebAuthnBrowser.startAuthentication(
        data.data,
        useBrowserAutofill
      )

      console.log('assertionResponse: ', assertionResponse)

      const verificationRes = await axios.post(
        '/api/webauthn/verify-login-auth',
        {
          data: assertionResponse,
        }
      )

      console.log('verifictionResponse: ', verificationRes)
      if (verificationRes.data.verfied) {
        setStatus('authenticated')
        setUser(verificationRes.data.user as AuthContextType['user'])
      }
    } catch (error) {
      console.log(error)
      return false
    }

    return true
  }

  const signOut = async () => {
    setStatus('unauthenticated')
    setUser(initialState.user)
  }

  return (
    <AuthCtx.Provider
      value={{
        status,
        user,
        handleDeviceRegistration,
        handleDeviceAuthentication,
        signOut,
        signup,
        login,
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export default AuthProvider
