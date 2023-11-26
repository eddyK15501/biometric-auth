import { AuthenticationAssertionPayload } from '@/app'
import { AuthenticatorsService } from '@/services/authenticator.service'
import { UserService } from '@/services/user.service'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { NextRequest, NextResponse } from 'next/server'
import { rpID, origin } from '../get-register-device-options/route'
import { AuthenticationResponseJSON } from '@simplewebauthn/typescript-types'

export async function POST(req: NextRequest) {
  const { data }: AuthenticationAssertionPayload = await req.json()
  const user = UserService.findById(data.response.userHandle || '')
  if (!user) {
    return NextResponse.json({ message: 'user not found', status: 403 })
  }

  const userAuthenticators = AuthenticatorsService.getUserAuthenticators(
    user.id ?? ''
  )
  if (!userAuthenticators) {
    return NextResponse.json({
      message: 'user authenticator not found',
      status: 403,
    })
  }

  const authenticator = AuthenticatorsService.getAuthenticatorByCredentialId(
    userAuthenticators.authenticators ?? [],
    data.rawId
  )

  if (!authenticator) {
    return NextResponse.json({
      message: 'authenticator not found',
      status: 403,
    })
  }

  try {
    authenticator.credentialPublicKey = Uint8Array.from(
      authenticator.credentialPublicKey
    )
    const verificationRes = await verifyAuthenticationResponse({
      response: data as unknown as AuthenticationResponseJSON,
      expectedChallenge: user.currentChallenge ?? '',
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    })

    return NextResponse.json({
      verified: verificationRes.verified,
      user: {
        email: user.email,
        id: user.id,
      },
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: `internal server error: ${error}`,
      status: 500,
    })
  }
}
