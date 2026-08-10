import bcrypt from 'bcrypt'

export function comparePassword(data: string, encrypted: string): Promise<boolean> {
  return bcrypt.compare(data, encrypted)
}

export function hashPassword(data: string, saltOrRounds: string | number): Promise<string> {
  return bcrypt.hash(data, saltOrRounds)
}
