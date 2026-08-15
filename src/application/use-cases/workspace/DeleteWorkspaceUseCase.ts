import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { AuthError } from "@shared/errors/AuthError";
import { NotFoundError } from "@shared/errors/NotFoundError";

export class DeleteWorkspaceUseCase {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly membershipRepository: IMembershipRepository
    ){}

    async execute(workspaceId:string,requestingUser:{id:string}): Promise<void>{

          const workspace = await this.workspaceRepository.findById(workspaceId);

         if(!workspace){
            throw new NotFoundError("Can't find this workspace");
         }


        const membership = await this.membershipRepository.findByUserAndWorkspace(requestingUser.id,workspaceId);

         if (!membership || !membership.canDeleteWorkspace()) {
            throw new AuthError("Access denied");
        }

        const allMemberships = await this.membershipRepository.findAllByWorkspaceId(workspaceId);
        await Promise.all(allMemberships.map(m => this.membershipRepository.delete(m.id)));
        await this.workspaceRepository.delete(workspaceId);


    }
}