import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { User } from '../'

export const UserService = {
  getUsers() {
    return JSON.parse(readFileSync('user.json', 'utf-8')) as User[]
  },
  findById(userId: string) {},
  findByEmail(email: string) {},
  updateUser(user: User) {},
  createUser(user: Pick<User, 'email' | 'password'>) {},
  saveUser(users: User[]) {
    writeFileSync('users.json', JSON.stringify(users))
  },
  loginUserBasic(user: Pick<User, 'email' | 'password'>) {},
}
