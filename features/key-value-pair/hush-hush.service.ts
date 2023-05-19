import * as crypto from 'crypto';
import { EnhancedError } from '../../lib';
import { SecretKeyManager } from './secret-key-manager';

export interface IHushHushConfig {
  algo: string;
  password_length: number;
  key_length: number;
  iv_length: number;  
}

const defaultConfig: IHushHushConfig = {
  algo: 'aes-256-ctr',
  password_length: 1,
  key_length: 32,
  iv_length: 16,
}

export class HushHushService {
  private config: IHushHushConfig;
  private secret: SecretKeyManager;

  constructor(config?: Partial<IHushHushConfig>) {
    this.config = {
      ...defaultConfig,
      ...config
    };
    this.secret = new SecretKeyManager(this.config.key_length);
  }

  test(password: string) {
    this.secret.build(password);
    const secretKey = this.secret.key.toString('hex');

    const text = `Lorem ipsum dolor sit amet, mea ut oratio recusabo suavitate, mel te paulo propriae, labores fierent sit no. Mollis nominavi persequeris ad vis, postea eruditi suscipit ei cum, erat alienum dissentiunt id has. Nec no consul vidisse delenit. No quas omnes eloquentiam mea. Putant deleniti antiopam mei in, eam appareat posidonium in. Eos ferri nostro suavitate et, ex pri dictas vocent adversarium.`;

    const cipher = this.encrypt(text);
    const decipher = this.decrypt(cipher);
    
    console.log("TEST: ", {password, secretKey, result: decipher.toString('utf-8') === text});
    return secretKey;
  }


  encrypt(text: string | Buffer) {
    text = this.convertToBuffer(text, 'Encrypt');
    if (!this.secret.isValid()) {
      throw new HushHushServiceError('encrypt()', 'Cannot Encrypt. Invalid secret key');
    }

    try {
      const {algo, iv_length} = this.config;

      const iv = crypto.randomBytes(iv_length);
      const cipher = crypto.createCipheriv(algo, this.secret.key, iv);
      const encrypted_data = Buffer.concat([cipher.update(text), cipher.final()]);
  
      return Buffer.concat([iv, encrypted_data]); //add iv to the start of the result              
    } 
    catch (error) {
      console.error(error);
      throw new HushHushServiceError('encrypt()', 'Unhandled error while encrypting');
    }
  }

  decrypt(data: string | Buffer) {
    data = this.convertToBuffer(data, 'Decrypt');
    if (!this.secret.isValid()) {
      throw new HushHushServiceError('decrypt()', 'Cannot Decrypt. Invalid secret key');
    }

    try {
      const {algo, iv_length} = this.config;

      const iv = data.subarray(0, iv_length);
      const encrypted_data = data.subarray(iv_length);
  
      const decipher = crypto.createDecipheriv(algo, this.secret.key, iv);
      const decrypted_data = Buffer.concat([decipher.update(encrypted_data), decipher.final()]);
  
      return decrypted_data;  
    } 
    catch (error) {
      console.error(error);
      throw new HushHushServiceError('decrypt()', 'Unhandled error while decrypting');
    }
  }
  

  private convertToBuffer(data: string | Buffer, process: 'Encrypt' | 'Decrypt') {
    if (typeof(data) === 'string') {
      data = Buffer.from(data, 'utf-8');
    }
    if (!(data instanceof Buffer)) {
      throw new HushHushServiceError('convertToBuffer()', `Cannot ${process}. Was expecting text as either a string or Buffer`);
    }

    return data;
  }
    
}


export class HushHushServiceError extends EnhancedError {
  
  constructor(feature: string, message: string) {
    super(feature, 'HushHushServiceError', message);
  }
}