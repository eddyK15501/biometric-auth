import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type { AuthenticatorType, singleUserAuthenticator } from '../'

export const CollectionOfUserAuthenticators: Array<singleUserAuthenticator> = []
export const AuthenticatorsService = {
  getCollectionOfUserAuthenticators() {
    return JSON.parse(
      readFileSync('users-authenticators.json', 'utf-8')
    ) as singleUserAuthenticator[]
  },
  getUserAuthenticatorsIndex(userId: string) {},
  getUserAuthenticators(userId: string | undefined) {
    return []
  },
  async storeUserAuthenticator(
    userId: string,
    newAuthenticator: AuthenticatorType
  ) {},
  getAuthenticatorByCredentialId(
    userAuthenticators: AuthenticatorType[],
    authenticatorCredentialIdB64URL: string
  ) {},
}
