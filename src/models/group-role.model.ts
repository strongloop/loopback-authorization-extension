import { model, belongsTo } from "@loopback/repository";
import { Group, GroupWithRelations, Role, RoleWithRelations } from ".";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class GroupRole extends HistoryEntity {
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
