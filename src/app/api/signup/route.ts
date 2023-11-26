import { UserService } from '@/services/user.service'
import { NextRequest, NextResponse } from 'next/server'
type createUserPayload = {
  email: string
  password: string
}

export async function POST(req: NextRequest) {
  console.log('api signup is called...')
  const { email, password }: createUserPayload = await req.json()
  console.log(`from api, email: ${email}, password: ${password}`)

  const existingUser = UserService.findByEmail(email)
  if (existingUser) {
    return NextResponse.json({ error: 'something wrong' }, { status: 400 })
  }
  UserService.createUser({
    email,
    password,
  })

  return NextResponse.json(
    {
      message: 'User successfully created!',
    },
    { status: 201 }
  )
}
