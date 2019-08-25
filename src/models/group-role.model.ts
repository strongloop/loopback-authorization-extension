import { Entity, model, property, belongsTo } from "@loopback/repository";
import { Group, GroupWithRelations, Role, RoleWithRelations } from ".";

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
    groupId: string;

    @belongsTo(() => Role)
    roleId: string;

    constructor(data?: Partial<GroupRole>) {
        super(data);
    }
}

export interface GroupRoleRelations {
    group: GroupWithRelations;
    role: RoleWithRelations;
}

export type GroupRoleWithRelations = GroupRole & GroupRoleRelations;
