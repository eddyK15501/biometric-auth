import type { User, singleUserAuthenticator } from '@/app'
import { AuthenticatorsService } from '@/services/authenticator.service'
import { UserService } from '@/services/user.service'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

export const rpName = 'my-special-site'
export const rpID = 'localhost'
export const origin = `http://${rpID}:3001`

const getPublicKeyCredentialCreationOptions = async (user: User) => {
  console.log('received user: ', user)
  const userAuthenticators: singleUserAuthenticator | null =
    AuthenticatorsService.getUserAuthenticators(user.id ?? '')
  console.log('userAuthenticators', userAuthenticators)
  const challenge = crypto.randomBytes(20).toString('base64url')
  console.log('challenge: ', challenge)
  let options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id ?? '',
    userName: user.email,
    challenge,
    excludeCredentials: !userAuthenticators
      ? []
      : (userAuthenticators.authenticators?.map((a) => ({
          id: a.credentialID,
          type: 'public-key',
        })) as PublicKeyCredentialDescriptor[]),
    timeout: 1000 * 60 * 2,
    attestationType: 'none',
  })
  user.currentChallenge = challenge
  options.challenge = challenge
  UserService.updateUser(user)
  console.log('options in server: ', options)
  return options
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const user: User | undefined = UserService.findByEmail(data.email)
  if (!user) {
    return NextResponse.json({ message: 'user not exist', status: 400 })
  }
  const opt = await getPublicKeyCredentialCreationOptions(user)
  console.log('opt: ', opt)
  return NextResponse.json(opt)
}
