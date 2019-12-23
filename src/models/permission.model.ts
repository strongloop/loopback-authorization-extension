import { model, property, hasMany, Entity } from "@loopback/repository";

import { RolePermission, RolePermissionWithRelations } from "./";

@model({ settings: {} })
export class Permission extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @property({
        type: "string",
        required: true,
        index: {
            unique: true
        }
    })
    key: string;

    @property({
        type: "string",
        default: ""
    })
    description: string;

    @hasMany(() => RolePermission, { keyTo: "permissionId" })
    rolePermissions: RolePermissionWithRelations[];

    constructor(data?: Partial<Permission>) {
        super(data);
    }
}

export interface PermissionRelations {}

export type PermissionWithRelations = Permission & PermissionRelations;
