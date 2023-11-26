import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { User } from '@/app/index.d.ts'

export const UserService = {
  getUsers() {
    return JSON.parse(
      readFileSync(process.cwd() + '/users.json', 'utf-8')
    ) as User[]
  },

  findById(userId: string) {
    return this.getUsers().find((e) => e.id === userId)
  },

  findByEmail(email: string) {
    return this.getUsers().find((e) => e.email === email)
  },

  updateUser(user: User) {
    const users = this.getUsers()
    const res = users.splice(Number(user.id) - 1, 1, user)
    this.saveUsers(users)
  },

  createUser(user: Pick<User, 'email' | 'password'>) {
    const { email, password } = user
    console.log(`email: ${email}, password: ${password}`)
    const users = this.getUsers()
    users.push({
      email,
      password,
      id: String(users.length + 1),
      currentChallenge: '',
    })
    console.log('users: ', users)

    this.saveUsers(users)
    return user
  },

  saveUsers(users: User[]) {
    writeFileSync(process.cwd() + '/users.json', JSON.stringify(users))
  },

  loginUserBasic(user: Pick<User, 'email' | 'password'>) {},
}
