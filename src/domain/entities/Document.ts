import { DocumentKind, DocumentStatus } from "@shared/enums";

export class Document {
    constructor(
        public readonly id: string,
        public readonly workspaceId: string,     // isolation multi-tenant, jamais réassignable
        public readonly uploadedBy: string,      // userId
        public fileUrl: string  | null,
        public readonly originalFileName: string,
        public documentKind: DocumentKind | null,        // 'photo' | 'structured_document'
        public documentType: string | null,       // ex: 'acte_naissance' — null tant que non classifié
        public extractedFields: Record<string, unknown> | null,
        public description: string | null,
        public embedding: number[] | null,
        public status: DocumentStatus,          
        public readonly createdAt: Date
    )
    {}

   /**
   * Crée un nouveau document au moment de l'upload initial.
   * L'URL Cloudinary, le type de contenu (photo/document structuré) et les métadonnées
   * ne sont pas encore connus à ce stade : ils seront renseignés par markAsIndexed()
   * une fois le pipeline LangGraph terminé. Statut initial forcé à PROCESSING.
   */
  static createNew(id: string, workspaceId: string, uploadedBy: string, originalFileName: string): Document {
    return new Document(
      id,
      workspaceId,
      uploadedBy,
      null, // L'URL Cloudinary n'existe pas encore
      originalFileName,
      null,
      null,
      null,
      null,
      null,
      DocumentStatus.PROCESSING, // Statut explicite dès la création
      new Date()
    );
  }

  /**
   * Reconstitue un document existant à partir des données brutes issues de PostgreSQL.
   * Utilisé exclusivement par le repository — ne contient aucune règle métier,
   * contrairement à createNew(), qui applique les valeurs par défaut d'un nouveau document.
   */
  static load(data: any): Document {
    return new Document(
      data.id, data.workspaceId, data.uploadedBy, data.fileUrl, data.originalFileName,
      data.documentKind, data.documentType, data.extractedFields, data.description, 
      data.embedding, data.status, data.createdAt
    );
  }

  /**
   * Marque le document comme indexé une fois l'analyse IA (Gemini) et l'upload
   * Cloudinary terminés. Fixe l'embedding, le type de contenu et l'URL définitive.
   * Les champs de metadata sont optionnels et varient selon qu'il s'agit d'une photo
   * (description) ou d'un document structuré (type + champs extraits).
   * Lève une erreur si le document est déjà indexé, pour empêcher une double indexation.
   */
  markAsIndexed(embedding: number[], kind: DocumentKind, fileUrl: string, metadata?: { type?: string, fields?: Record<string, unknown>, description?: string }): void {
    if (this.status === DocumentStatus.INDEXED) {
      throw new Error("Le document est déjà indexé.");
    }
    this.embedding = embedding;
    this.documentKind = kind;
    this.fileUrl = fileUrl;
    
    if (metadata?.type) this.documentType = metadata.type;
    if (metadata?.fields) this.extractedFields = metadata.fields;
    if (metadata?.description) this.description = metadata.description;
    
    this.status = DocumentStatus.INDEXED;
  }

  /**
   * Marque le document comme échoué (ex : erreur d'analyse Gemini, timeout,
   * fichier illisible). Permet à l'UI d'afficher un statut d'échec plutôt que
   * de laisser le document bloqué indéfiniment en PROCESSING.
   */
  markAsFailed(): void {
    this.status = DocumentStatus.FAILED;
  }
}