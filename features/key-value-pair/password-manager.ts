import { EnhancedError } from "../../lib";


export interface IPasswordManagerConfig {
  pwd_settings_path: string;
}

export class PasswordManager {

  constructor() {
    
  }

}





export class PasswordManagerError extends EnhancedError {
  
  constructor(feature: string, message: string) {
    super(feature, 'PasswordManagerError', message);
  }
}