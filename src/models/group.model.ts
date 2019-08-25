import { Entity, model, property, belongsTo } from "@loopback/repository";

@model({ settings: {} })
export class Group extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => Group)
    parentId: string;

    constructor(data?: Partial<Group>) {
        super(data);
    }
}

export interface GroupRelations {
    parent: GroupWithRelations;
}

export type GroupWithRelations = Group & GroupRelations;
