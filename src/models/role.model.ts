import { model, belongsTo, hasMany } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

import { UserRole, RolePermission } from "./";

@model({ settings: {} })
export class Role extends HistoryEntity {
    @belongsTo(() => Role)
    parentId: string;

    @hasMany(() => UserRole, { keyTo: "roleId" })
    userRoles: UserRole[];

    @hasMany(() => RolePermission, { keyTo: "roleId" })
    rolePermissions: RolePermission[];

    constructor(data?: Partial<Role>) {
        super(data);
    }
}

export interface RoleRelations {
    parent: RoleWithRelations;
}

export type RoleWithRelations = Role & RoleRelations;
