import { Workspace } from "@domain/entities/Workspace";
import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";

export class ListUserWorkspacesUseCase {
    constructor(
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly membershipRepository: IMembershipRepository
    ){}

    async execute(requestingUser:{id:string}): Promise<Workspace[]>{

          const memberships = await this.membershipRepository.findAllByUserId(requestingUser.id);

          const workspaces =  await Promise.all(
            memberships.map(m => this.workspaceRepository.findById(m.workspaceId))
          );


          return workspaces.filter((w): w is Workspace => w !== null);

    }
}