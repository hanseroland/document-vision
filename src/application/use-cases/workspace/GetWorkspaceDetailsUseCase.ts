import { Workspace } from "@domain/entities/Workspace";
import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class GetWorkspaceDetailsUseCase {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly membershipRepository: IMembershipRepository
    ){}

    async execute(workspaceId:string, requestingUser:{id:string}): Promise<Workspace> {

        const existingWorkspace = await this.workspaceRepository.findById(workspaceId);

          if(!existingWorkspace){
            throw new NotFoundError("Can't find this workspace");
        }
        
        const membership = await this.membershipRepository.findByUserAndWorkspace(requestingUser.id,workspaceId);

        if (!membership) {
            throw new AuthError("Access denied");
        }

    
        return existingWorkspace;

    }
}