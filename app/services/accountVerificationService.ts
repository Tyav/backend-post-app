import {
  AccountVerification,
  IAccountVerification,
} from '../model/accountVerificationModel';

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
  async create(user: string): Promise<IAccountVerification> {
    // delete existing account verification
    await AccountVerification.deleteMany({ user });
    const accountVerification = new AccountVerification({
      user: user,
    });
    return accountVerification.save();
  }

  /**
   * @description gets an account verifier
   */
  async get(user: string): Promise<IAccountVerification | null> {
    return AccountVerification.findOne({ user });
  }
}

export default new AccountVerificationService();
