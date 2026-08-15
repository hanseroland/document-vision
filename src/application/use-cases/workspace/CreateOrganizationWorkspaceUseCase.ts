import { Membership } from "@domain/entities/Membership";
import { Workspace } from "@domain/entities/Workspace";
import { IMembershipRepository } from "@domain/repositories/IMembershipRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IWorkspaceRepository } from "@domain/repositories/IWorkspaceRepository";
import { MembershipRole, WorkSpaceType } from "@shared/enums";
import { ValidationError } from "@shared/errors/ValidationError";
import { CreateWorkspaceDTO } from "@shared/types";
import { randomUUID } from 'crypto';


export class CreateOrganizationWorkspaceUseCase {
    constructor(
       private readonly workspaceRepository: IWorkspaceRepository,
       private readonly userRepository: IUserRepository,
       private membershipRepository : IMembershipRepository
    ){}

    async execute(dto:CreateWorkspaceDTO,requestingUser:{id:string}): Promise<Workspace>{
        
        const existingUser = await this.userRepository.findById(requestingUser.id);
        if(!existingUser){
            throw new ValidationError('This user doesn\'t exist');
        }

        const workspace = new Workspace(
            randomUUID(),
            WorkSpaceType.ORGANIZATION,
            dto.name,
            existingUser.id,
            new Date(),
        )

        await this.workspaceRepository.save(workspace);

        const membership = new Membership(
            randomUUID(),
            existingUser.id,
            workspace.id,
            MembershipRole.OWNER,
            new Date(),  
            new Date(),
        );

        await this.membershipRepository.save(membership);

        return workspace;

    }
}