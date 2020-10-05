import User from '../infra/typeorm/entities/User';
import IUserMapDTO from '../dtos/IUserMapDTO';

export default class UserMap {
  public static toDTO(user: User): IUserMapDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
