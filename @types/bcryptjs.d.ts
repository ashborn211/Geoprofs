declare module 'bcryptjs' {
    export function hash(data: string, salt: number | string): Promise<string>;
    export function compare(data: string, encrypted: string): Promise<boolean>;
  }
  