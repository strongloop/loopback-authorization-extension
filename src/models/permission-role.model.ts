import { Entity, model, property, belongsTo } from "@loopback/repository";

import { Permission, Role } from "./";

@model()
export class PermissionRole extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => Permission, { keyTo: "id" })
    permission: Permission;

    @belongsTo(() => Role, { keyTo: "id" })
    role: Role;

    constructor(data?: Partial<PermissionRole>) {
        super(data);
    }
}
