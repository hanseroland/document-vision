export class RefreshToken {
  constructor(
    public readonly id: string,
    public token: string,
    public userId: string,
    public expiresAt: Date,
    public readonly createdAt: Date
  ) {}
}
