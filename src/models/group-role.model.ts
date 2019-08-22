import { Entity, model, property, belongsTo } from "@loopback/repository";
import { Group, Role } from ".";

@model({ settings: {} })
export class GroupRole extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => Group)
    group: string;

    @belongsTo(() => Role)
    role: string;

    constructor(data?: Partial<GroupRole>) {
        super(data);
    }
}

export interface GroupRoleRelations {
    // describe navigational properties here
}

export type GroupRoleWithRelations = GroupRole & GroupRoleRelations;
