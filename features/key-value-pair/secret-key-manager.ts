import * as crypto from 'crypto';
import { EnhancedError } from '../../lib';

export class SecretKeyManager {
  private readonly LENGTH: number;
  private readonly SALT: Buffer;

  private _key: Buffer | null = null;
  get key() {
    if (!this._key) {
      throw new SecretKeyManagerError('get()', "The key has not been set. Use .build()");
    }
    if (this._key.length !== this.LENGTH) {
      throw new SecretKeyManagerError('get()', `Key is not the correct length.  Expected: ${this.LENGTH}, but got ${this._key.length}`);
    }

    return this._key;
  }

  constructor(length: number, salt?: string) {
    this.LENGTH = length;

    this.SALT = typeof (salt) === 'string'
      ? Buffer.alloc(this.LENGTH, salt, 'utf-8')
      : this.deriveSalt();
  }

  build(password: string) {
    password = this.sanitize(password);
    this._key = crypto.scryptSync(password, this.SALT, this.LENGTH);
  }

  isValid() {
    return this._key?.length === this.LENGTH;
  }

  //overload
  toString() {
    return this.key.toString('utf-8');
  }

  private sanitize(text: string) {
    //just to be sure
    if (typeof (text) !== 'string') {
      throw new SecretKeyManagerError('sanitize()', `Can only sanitize strings, instead received: ${typeof (text)}`);
    }

    text = text.normalize("NFC"); //accents can be tricky

    return text;
  }

  private deriveSalt() {
    return crypto.randomBytes(this.LENGTH);
  }
}


export class SecretKeyManagerError extends EnhancedError {

  constructor(feature: string, message: string) {
    super(feature, 'SecretKeyManagerError', message);
  }

}