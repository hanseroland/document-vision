import { MembershipRole } from "@shared/enums";

export class Invitation {
    constructor(
        public readonly id:string,
        public readonly workspaceId:string,
        public readonly invitedEmail:string,
        public role : MembershipRole,
        public readonly invitedBy: string, //userId
        public readonly token: string, // pour le lien d'invitation
        public readonly expiresAt: Date,
        public acceptedAt: Date | null,
        public readonly createdAt: Date
    ){}

    /**
     * Vérificateur d'état temporel.
       Comparer la date limite de l'invitation (expiresAt) avec la date actuelle.
       Un lien d'invitation ne doit pas être valide indéfiniment pour des raisons de sécurité. 
       Cette méthode permet de savoir si l'invitation est encore utilisable ou si l'utilisateur 
       doit en demander une nouvelle.
     */
    isExpired(): boolean {
    return new Date() > this.expiresAt;
    }


    /**
     * Vérificateur de statut.
     * Indiquer si le champ acceptedAt contient une date ou s'il est à null.
     * Pour éviter qu'une personne valide deux fois la même invitation ou tente de réutiliser 
     * un jeton (token) d'invitation qui a déjà été consommé.
     */
    isAccepted(): boolean {
        return this.acceptedAt !== null;
    }

    /**
     * Mutation d'état métier (Action).
     * Renseigner acceptedAt avec la date et l'heure exactes du moment où l'action est exécutée (new Date()).
     * C'est l'action métier fondamentale qui concrétise l'acceptation. Elle permet de garder 
     * un historique précis du moment où l'utilisateur a rejoint l'espace.
     */
    accept(): void {
        this.acceptedAt = new Date();
    }
}