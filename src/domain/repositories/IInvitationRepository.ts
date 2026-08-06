import { Invitation } from "@domain/entities/Invitation";


export interface IInvitationRepository {
    findById(id: string): Promise<Invitation | null>;
    findByToken(token: string): Promise<Invitation | null>;
    findByWorkspaceAndEmail(workspaceId: string, email: string): Promise<Invitation | null>;
    save(invitation: Invitation): Promise<void>;
    delete(id: string): Promise<void>;
}