import { Document } from "@domain/entities/Document";

export interface DocumentSearchFilters {
    documentKind?: "photo" | "structured_document";
    documentType?: string;
    extractedFields?: Record<string, unknown>;
    startDate?: Date;
    endDate?: Date;
}

export interface IDocumentRepository {
    findById(id: string, workspaceId: string): Promise<Document | null>;
    save(document: Document): Promise<void>;
    delete(id: string, workspaceId: string): Promise<void>;

    /** Recherche par similarité sémantique (vecteur cosine distance / pgvector) */
    searchVector(
        workspaceId: string,
        embedding: number[],
        limit?: number
    ): Promise<Document[]>;

    /** Recherche par filtres structurés (métadonnées JSONB / SQL) */
    searchStructured(
        workspaceId: string,
        filters: DocumentSearchFilters,
        limit?: number
    ): Promise<Document[]>;

    /** Recherche hybride : combine la pertinence vectorielle et les filtres structurés */
    searchHybrid(
        workspaceId: string,
        embedding: number[],
        filters: DocumentSearchFilters,
        limit?: number
    ): Promise<Document[]>;
}