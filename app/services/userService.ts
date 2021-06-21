import { User, IUser } from '../model/userModel';

export class UserService {
  /**
   * @description Creates a user
   */
  async create(body: IUser): Promise<IUser> {
    const retailer = new User(body);
    return retailer.save();
  }

  /**
   * @description gets a user by email
   */
  async getByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({
      email,
    });
    return user;
  }

  /**
   * @description get a user by Id
   */
  async getById(id: String): Promise<IUser | null> {
    const user = await User.findById(id);
    return user;
  }

}

export default new UserService();
