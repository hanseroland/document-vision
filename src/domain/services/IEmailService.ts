export interface IEmailService {
  sendActivationEmail(to: string, activationToken: string): Promise<void>;
  sendWorkspaceInvitation(to: string, workspaceName: string, token: string): Promise<void>;
  sendResetPasswordEmail(to: string, resetToken: string): Promise<void>;
}
