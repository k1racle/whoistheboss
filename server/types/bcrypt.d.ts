declare module 'bcrypt' {
  const bcrypt: {
    compare(data: string, encrypted: string): Promise<boolean>
    hash(data: string, saltOrRounds: string | number): Promise<string>
  }

  export default bcrypt
}
