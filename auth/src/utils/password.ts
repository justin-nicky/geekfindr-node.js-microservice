import bcrypt from 'bcryptjs'

export class Password {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }
  static async comparePasswords(
    enteredPassword: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, hash)
  }
}
