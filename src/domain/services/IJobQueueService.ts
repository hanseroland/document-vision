export interface IJobQueueService {
    enqueueDocumentIngestion(documentId: string, localFilePath: string, workspaceId: string): Promise<void>;
}