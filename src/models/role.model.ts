import { model, belongsTo, hasMany } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

import {
    UserRole,
    UserRoleWithRelations,
    RolePermission,
    RolePermissionWithRelations
} from "./";

@model({ settings: {} })
export class Role extends HistoryEntity {
    @belongsTo(() => Role, { keyFrom: "parentId", keyTo: "id" })
    parentId: string;

    @hasMany(() => UserRole, { keyTo: "roleId" })
    userRoles: UserRoleWithRelations[];

    @hasMany(() => RolePermission, { keyTo: "roleId" })
    rolePermissions: RolePermissionWithRelations[];

    constructor(data?: Partial<Role>) {
        super(data);
    }
}

export interface RoleRelations {
    parent: RoleWithRelations;
}

export type RoleWithRelations = Role & RoleRelations;
