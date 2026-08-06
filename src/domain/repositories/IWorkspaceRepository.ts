import { Workspace } from "@domain/entities/Workspace";


export interface IWorkspaceRepository {
    findById(id:string): Promise<Workspace | null>;
    findByOwnerId(id:string): Promise<Workspace[]>;
    save(workspace:Workspace): Promise<void>;
    delete(id:string): Promise<void>;
}