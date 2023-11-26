import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import type {
  AuthenticatorType,
  singleUserAuthenticator,
} from '@/app/index.d.ts'

export const CollectionOfUserAuthenticators: Array<singleUserAuthenticator> = []

export const AuthenticatorsService = {
  getCollectionOfUserAuthenticators() {
    return JSON.parse(
      readFileSync('users-authenticators.json', 'utf-8')
    ) as singleUserAuthenticator[]
  },
  getUserAuthenticatorsIndex(userId: string) {
    return this.getCollectionOfUserAuthenticators().findIndex(
      (e) => e.userId === userId
    )
  },
  getUserAuthenticators(userId: string) {
    let userAuthenticator = this.getCollectionOfUserAuthenticators().find(
      (e) => e.userId === userId
    )
    if (!userAuthenticator) return null
    userAuthenticator.authenticators = userAuthenticator.authenticators?.map(
      (a) => ({
        ...a,
        credentialID: Uint8Array.from(a.credentialID),
      })
    )
    return userAuthenticator
  },
  async storeUserAuthenticator(
    userId: string | undefined,
    newAuthenticator: AuthenticatorType
  ) {
    if (!userId) return
    const collectionOfUserAuthenticators =
      this.getCollectionOfUserAuthenticators()
    let index = this.getUserAuthenticatorsIndex(userId)
    let userAuthenticators: singleUserAuthenticator
    if (index === -1) {
      userAuthenticators = {
        userId: userId,
        authenticators: [],
      }
    } else {
      userAuthenticators = collectionOfUserAuthenticators[index]
    }
    newAuthenticator.credentialID = Array.from(newAuthenticator.credentialID)
    newAuthenticator.credentialPublicKey = Array.from(
      newAuthenticator.credentialPublicKey
    )
    userAuthenticators.authenticators?.push(newAuthenticator)
    if (index === -1) {
      collectionOfUserAuthenticators.push(userAuthenticators)
    } else {
      collectionOfUserAuthenticators[index] = userAuthenticators
    }
    writeFileSync(
      process.cwd() + '/users-authenticators.json',
      JSON.stringify(collectionOfUserAuthenticators)
    )
  },
  getAuthenticatorByCredentialId(
    userAuthenticators: AuthenticatorType[],
    authenticatorCredentialIdB64URL: string
  ) {
    return userAuthenticators.find(
      (a) =>
        Buffer.from(a.credentialID).toString('base64url') ===
        authenticatorCredentialIdB64URL
    )
  },
}
