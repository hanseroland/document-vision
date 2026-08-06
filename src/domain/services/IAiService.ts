export interface PhotoAnalysisResult {
  description: string;
  embedding: number[];
}

export interface DocumentAnalysisResult {
  documentType: string;
  extractedFields: Record<string, unknown>;
  embedding: number[];
}

export interface IAiService {
  /**
   * Génère un vecteur d'embedding à partir d'un texte (pour la recherche sémantique)
   */
  generateEmbedding(text: string): Promise<number[]>;

  /**
   * Analyse une photo : génère une description visuelle et son embedding
   */
  analyzePhoto(localFilePath: string): Promise<PhotoAnalysisResult>;

  /**
   * Analyse un document administratif/professionnel : extrait le type + champs structurés + embedding
   */
  analyzeDocument(localFilePath: string): Promise<DocumentAnalysisResult>;
}