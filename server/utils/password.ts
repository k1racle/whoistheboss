import { createRequire } from 'node:module'

interface BcryptModule {
  compare(data: string, encrypted: string): Promise<boolean>
  hash(data: string, saltOrRounds: string | number): Promise<string>
}

const require = createRequire(import.meta.url)
const bcrypt = require('bcrypt') as BcryptModule

export function comparePassword(data: string, encrypted: string): Promise<boolean> {
  return bcrypt.compare(data, encrypted)
}

export function hashPassword(data: string, saltOrRounds: string | number): Promise<string> {
  return bcrypt.hash(data, saltOrRounds)
}
