export type AuthContextType = {
  status: string
  user: User | null
  handleDeviceRegistration: (username?: string) => Promise<boolean>
  handleDeviceAuthentication: (
    email: string,
    useBrowserAutofill?: boolean
  ) => Promise<boolean>
  signup: (email: string, password: string) => {}
  login: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

export type authStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type User = {
  id?: string
  email: string
  currentChallenge?: string
  password?: string
}

export type AuthenticatorType = {
  credentialID: Uint8Array | Array
  credentialPublicKey: Uint8Array | Array
  counter: number
}

export type singleUserAuthenticator = {
  userId?: string
  authenticators?: AuthenticatorType[]
}

export type verificationPayload = {
  email: string
  data: any
}

export type AuthenticationAssertionPayload = any
