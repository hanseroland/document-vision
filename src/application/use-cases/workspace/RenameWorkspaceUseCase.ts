import { Workspace } from "@domain/entities/Workspace";
import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";
import { UpdateWorkspaceDTO } from "@shared/types";

export class RenameWorkspaceUseCase {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
         private readonly membershipRepository: IMembershipRepository,
        
    ){}

    async execute(workspaceId:string,dto:UpdateWorkspaceDTO,  requestingUser:{id:string}): Promise<Workspace>{

        const workspace = await this.workspaceRepository.findById(workspaceId);
        if(!workspace){
            throw new NotFoundError('This workspace doesn\'t exist');
        }

        const membership = await this.membershipRepository.findByUserAndWorkspace(requestingUser.id,workspaceId);

        if(!membership || !membership.canRenameWorkspace()){
            throw new AuthError('Access denied');
        }

        workspace.name = dto.name ?? workspace.name;

        await this.workspaceRepository.save(workspace);

        return workspace;
    }
}