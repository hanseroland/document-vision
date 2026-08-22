import { User } from '@domain/entities/User';


export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>; 
  findByActivationToken(token: string): Promise<User | null>;
  findByResetPasswordToken(token: string): Promise<User | null>;
  save(user:User): Promise<void>;
}
