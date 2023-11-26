import { User } from '@/app'
import { AuthenticatorsService } from '@/services/authenticator.service'
import { UserService } from '@/services/user.service'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data: User = await req.json()
  const user = UserService.findByEmail(data.email)
  if (!user) {
    return NextResponse.json({ message: 'user not found', status: 400 })
  }

  const userAuthenticators = AuthenticatorsService.getUserAuthenticators(
    user.id ?? ''
  )
  if (!userAuthenticators) {
    return NextResponse.json({ message: 'no authenticator', status: 400 })
  }

  const options = await generateAuthenticationOptions({
    allowCredentials: userAuthenticators.authenticators?.map((a) => ({
      id: a.credentialID,
      type: 'public-key',
    })),
    userVerification: 'preferred',
    timeout: 60 * 1000 * 5,
  })

  user.currentChallenge = options.challenge

  console.log('authentication options: ', options)

  UserService.updateUser(user)
  return NextResponse.json({ data: options })
}
