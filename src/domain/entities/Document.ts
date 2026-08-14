import { DocumentKind, DocumentStatus } from "@shared/enums";

export class Document {
    constructor(
        public readonly id: string,
        public readonly workspaceId: string,     // isolation multi-tenant, jamais réassignable
        public readonly uploadedBy: string,      // userId
        public fileUrl: string  | null,// URL Cloudinary du fichier stocké. null tant que l'upload définitif n'a pas eu lieu
        public readonly originalFileName: string, // Le nom du fichier tel qu'uploadé par l'utilisateur (ex: photo_vacances.jpg),
        public documentKind: DocumentKind | null, // 'photo' | 'structured_document' Indique si le fichier est une photo ou un document structuré, c'est cette valeur qui détermine quel chemin du pipeline LangGraph s'applique
        public documentType: string | null,       // ex: 'acte_naissance' — null tant que non classifié
        public extractedFields: Record<string, unknown> | null, //Les champs extraits par l'IA pour un document structuré (nom, date, numéro...)
        public description: string | null,// La description sémantique générée par l'IA pour une photo (ex: "plage au coucher de soleil, deux personnes")
        public embedding: number[] | null,// Le vecteur numérique représentant le "sens" du contenu (généré à partir de la description pour une photo, ou du texte extrait pour un document), utilisé pour la recherche par similarité vectorielle (pgvector
        public status: DocumentStatus,      // L'état du document dans le pipeline de traitement (PROCESSING / INDEXED / FAILED). C'est ce qui permet à l'UI d'afficher "en cours d'analyse"   
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