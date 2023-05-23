import * as crypto from 'crypto';
import { EnhancedError } from "../../lib";
import { PasswordConfig, PasswordSuitcase, emptyPasswordSuitcase } from "./password.models";


export class PasswordManager {
  private _config: PasswordConfig;
  private _suitcase: PasswordSuitcase;

  constructor(config: PasswordConfig, suitcase?: PasswordSuitcase) {
    this._config = config;
    this._suitcase = {...emptyPasswordSuitcase, ...suitcase};
  }

  isValid() {
    return this._suitcase.guid.length === this._config.guid_len;
  }

    //#region --- STATIC ---

    static getRandomGuid(): string {
      return crypto.randomUUID();
    }
  
  
    static getRandomString(size: number, inclSpecialChars?: boolean): string {
      const dictionary = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        + (inclSpecialChars ? '`~!@#$%^&*()_-+=<>,.?{][}|' : '');  //no slashes
  
      return [...crypto.randomBytes(size)]
        .map((b,i) => dictionary.charAt(b % dictionary.length))
        .slice(0, size)  //just in case :-)
        .join('');
    }

    static hash(text: string, salt: string, iterations = 1000) {
      return crypto.pbkdf2Sync(text, salt, iterations, 512, 'sha512');      
    }
  
    //#endregion
  
  
}





export class PasswordManagerError extends EnhancedError {
  
  constructor(feature: string, message: string) {
    super(feature, 'PasswordManagerError', message);
  }
}