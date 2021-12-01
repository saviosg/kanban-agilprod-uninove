import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './user.entity';

type LoadableUserKeys = Exclude<keyof User, Symbol>;

export class UserRepository extends EntityRepository<User> {
  public async emailInUse(email: string): Promise<boolean> {
    const result = await this.findOne({ email: email });
    return !!result;
  }

  public async getUserById(userId: number): Promise<User | null> {
    const user = await this.findOne({ id: userId });
    return user;
  }

  public async getUserByEmail(email: string, loadLazy?: LoadableUserKeys[]): Promise<User | null> {
    const user = await this.findOne<LoadableUserKeys>({ email: email }, { populate: loadLazy });
    return user;
  }
}
