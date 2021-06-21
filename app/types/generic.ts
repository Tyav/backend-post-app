import { AccountType } from '../model/accountVerificationModel';

export function enumToArray(enumObject: any): string[] {
  const keys: string[] = (Object.values(enumObject) as string[]).filter(key => key);
  return keys;
}

export interface IForgotPasswordToken {
  id: string;
  userType: AccountType;
}
