import {
  AccountVerification,
  IAccountVerification,
} from '../model/accountVerificationModel';
import TokenService from './tokenService';
// import emailService from './emailService';

export class AccountVerificationService {
  /**
   *
   * @description Deletes a verification
   */
  async delete(id: string) {
    return AccountVerification.findByIdAndDelete(id);
  }
  /**
   * @description Creates an account verifier
   */
  async create(data: Partial<IAccountVerification>): Promise<IAccountVerification> {
    // delete existing account verification
    await AccountVerification.deleteMany({ ...data });

    let token = TokenService.generateCode();
    let generate = true;
    const accountVerification = new AccountVerification({
      user: data.user,
      type: data.type
    } as IAccountVerification);

    while (generate) {
      try {
        // create account accountVerification
        accountVerification.token = token;  // TODO: Impliment retry at most 5 times
        await accountVerification.save();
        // if no error is thrown, exit loop
        generate = false;
      } catch (error) {
        // if error exist generate new code
        token = TokenService.generateCode();
      }
    }
    return accountVerification;
  }

  /**
   * @description gets an account verifier
   */
  async get(token: string, user: any): Promise<IAccountVerification | null> {
    return AccountVerification.findOne({ token, user });
  }
}

export default new AccountVerificationService();
