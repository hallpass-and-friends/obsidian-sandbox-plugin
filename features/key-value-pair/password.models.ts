
export type PasswordSuitcase = {
  guid: string;
  secret: string;
  code: string;
  salt: string;
}
export const emptyPasswordSuitcase: PasswordSuitcase = {
  guid: '',
  secret: '',
  code: '',
  salt: ''
}

export type PasswordConfig = {
  guid_len: 36; //fixed (includes hyphens)
  password_len: number;
  salt_len: number;
}