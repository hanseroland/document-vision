import { WorkSpaceType } from "@shared/enums";

export class Workspace {
    constructor(
        public readonly id: string,
        public readonly type: WorkSpaceType,
        public name:string,
        public readonly ownerId:string,  // référence au User créateur
        public readonly createdAt: Date
    )
    {}

}