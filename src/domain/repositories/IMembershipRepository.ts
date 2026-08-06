import { Membership } from "@domain/entities/Membership";

export interface IMembershipRepository {
    findById(id:string): Promise<Membership | null>;
    /** Clé de voûte de la sécurité : trouver le rôle d'un user dans un workspace précis */
    findByUserAndWorkspace(userId: string, workspaceId: string): Promise<Membership | null>;
    findAllByWorkspaceId(workspaceId: string): Promise<Membership[]>;
    findAllByUserId(userId: string): Promise<Membership[]>;
    save(membership: Membership): Promise<void>;
    delete(id: string): Promise<void>;


}