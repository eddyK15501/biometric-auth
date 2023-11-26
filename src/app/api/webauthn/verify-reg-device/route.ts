import { NextRequest, NextResponse } from 'next/server'
import { AuthenticatorType, verificationPayload } from '../../../index'
import { UserService } from '@/services/user.service'
import {
  VerifiedRegistrationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { RegistrationResponseJSON } from '@simplewebauthn/typescript-types'
import { rpID, rpName, origin } from '../get-register-device-options/route'
import { AuthenticatorsService } from '@/services/authenticator.service'

export async function POST(req: NextRequest) {
  const { data, email }: verificationPayload = await req.json()
  if (!email) {
    return NextResponse.json({ message: 'invalid email', status: 400 })
  }

  const user = UserService.findByEmail(email)
  if (!user) {
    return NextResponse.json({ message: 'user not found', status: 400 })
  }

  try {
    if (!user.currentChallenge) {
      return NextResponse.json({ message: 'challenge is missing', status: 400 })
    }

    const verificationResult: VerifiedRegistrationResponse =
      await verifyRegistrationResponse({
        response: data as unknown as RegistrationResponseJSON,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      })

    if (!verificationResult.verified) {
      return NextResponse.json({ message: 'verification failed', status: 400 })
    }

    if (verificationResult.registrationInfo) {
      const { credentialPublicKey, credentialID, counter } =
        verificationResult.registrationInfo
      const newAuthenticator: AuthenticatorType = {
        credentialPublicKey,
        credentialID,
        counter,
      }

      AuthenticatorsService.storeUserAuthenticator(user.id, newAuthenticator)
    }

    return NextResponse.json({ message: 'verified', status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: `verification failed with error ${error}`,
      status: 500,
    })
  }
}
