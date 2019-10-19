import { model, belongsTo } from "@loopback/repository";
import {
    Role,
    RoleWithRelations,
    Permission,
    PermissionWithRelations
} from ".";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class RolePermission extends HistoryEntity {
    @belongsTo(() => Role)
    roleId: string;

    @belongsTo(() => Permission)
    permissionId: string;

    constructor(data?: Partial<RolePermission>) {
        super(data);
    }
}

export interface RolePermissionRelations {
    role: RoleWithRelations;
    permission: PermissionWithRelations;
}

export type RolePermissionWithRelations = RolePermission &
    RolePermissionRelations;
