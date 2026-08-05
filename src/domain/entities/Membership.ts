import { MembershipRole } from "@shared/enums";


export class Membership {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly workspaceId: string,
    public role: MembershipRole,  
    public readonly invitedAt: Date,
    public joinedAt: Date | null
  ) {}

  /**
   * 
   * Gardien des autorisations de dépôt.
   * Vérifier que l'utilisateur est un membre actif qui a réellement rejoint le workspace (joinedAt !== null).
   * Empêcher une personne qui a seulement reçu une invitation en attente 
   * (mais ne l'a pas encore acceptée) d'uploader des fichiers dans un espace de travail d'entreprise.
   */
  canUpload(): boolean {
    return this.joinedAt !== null;
  }

  /**
   * Contrôleur de privilèges d'administration.
   * Vérifier si le rôle du membre est OWNER (propriétaire) ou ADMIN (administrateur).
   * Protéger l'organisation de l'espace. Un simple membre de l'entreprise ne 
   * doit pas pouvoir inviter d'autres personnes externes sans l'accord des responsables. 
   */
  canInviteMembers(): boolean {
    return this.role === MembershipRole.OWNER || this.role === MembershipRole.ADMIN;
  }

  /**
   * Gardien des actions destructives critiques.
   * Vérifier si le membre est exclusivement le OWNER de l'espace.
   * Sécurité maximale. Même un administrateur ne doit pas avoir 
   * le pouvoir de supprimer définitivement un espace de travail 
   * ou de détruire l'ensemble des documents d'une entreprise. 
   */
  canDeleteWorkspace(): boolean {
    return this.role === MembershipRole.OWNER;
  }
}