export interface StorageUploadResult {
  fileUrl: string;
  publicId: string;
}

export interface IStorageService {
  /**
   * Upload un fichier local vers un stockage distant (ex: Cloudinary)
   * @param localFilePath Chemin temporaire du fichier local
   * @param folder Dossier de destination (ex: workspaceId)
   */
  upload(localFilePath: string, folder?: string): Promise<StorageUploadResult>;

  /**
   * Supprime un fichier du stockage distant via son ID public
   */
  delete(publicId: string): Promise<void>;
}