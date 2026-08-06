export class RefreshToken {
  constructor(
    public readonly id: string,
    public token: string,
    public userId: string,
    public expiresAt: Date,
    public revokedAt: Date | null = null,
    public readonly createdAt: Date
  ) { }


  /**
   * Vérifie si le token a dépassé sa date limite de validité.
   */
  isExpired(now: Date = new Date()): boolean {
    return now > this.expiresAt;
  }

  /**
   * Vérifie si le token a été explicitement révoqué (ex: déconnexion).
   */
  isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  /**
   * Indique si le token est utilisable pour générer un nouvel Access Token.
   */
  isValid(now: Date = new Date()): boolean {
    return !this.isExpired(now) && !this.isRevoked();
  }

  /**
   * Révoque le token (action de déconnexion ou détection de fraude).
   */
  revoke(): void {
    if (this.isRevoked()) {
      throw new Error("Ce Refresh Token est déjà révoqué.");
    }
    this.revokedAt = new Date();
  }
}
