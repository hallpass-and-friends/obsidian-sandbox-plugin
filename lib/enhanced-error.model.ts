
export interface IEnhancedError {
  feature: string;
  name: string;
  message: string;
}

export class EnhancedError extends Error implements IEnhancedError {
  feature: string;

  constructor(message: string);
  constructor(name: string, message: string);
  constructor(feature: string, name: string, message: string);
  constructor(...params: string[]) {
    super();

    //defaults
    this.feature = "n/a";
    this.name = "EnhancedError";
    this.message = "Unknown Error";

    //parse the params
    switch(params?.length || 0) {
      case 1:
        this.message = params[0];
        break;
      case 2:
        this.name = params[0];
        this.message = params[1];
        break;
      case 3:
        this.feature = params[0];
        this.name = params[1];
        this.message = params[2];
        break;
    }
  }


  //override
  toString() {
    return `[${this.name}] -- ${this.feature} -- ${this.message}`;
  }
}