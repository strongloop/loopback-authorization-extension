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

    @hasMany(() => Role, { keyFrom: "id", keyTo: "parentId" } as any)
    childs: RoleWithRelations[];

    @hasMany(() => UserRole, { keyFrom: "id", keyTo: "roleId" } as any)
    userRoles: UserRoleWithRelations[];

    @hasMany(() => RolePermission, { keyFrom: "id", keyTo: "roleId" } as any)
    rolePermissions: RolePermissionWithRelations[];

    constructor(data?: Partial<Role>) {
        super(data);
    }
}

export interface RoleRelations {
    parent: RoleWithRelations;
}

export type RoleWithRelations = Role & RoleRelations;
