import { UserRole } from '@shared/enums';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public fullName: string,
    public password: string,
    public isActive: boolean,
    public activationToken: string | null,
    public activationTokenExpires: Date | null,
    public resetPasswordToken: string | null,
    public resetPasswordExpires: Date | null,
    public readonly createdAt: Date
  ) {}
}