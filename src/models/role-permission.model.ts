import { Entity, model, property, belongsTo } from "@loopback/repository";
import { Role, Permission } from ".";

@model({ settings: {} })
export class RolePermission extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => Role)
    role: string;

    @belongsTo(() => Permission)
    permission: string;

    constructor(data?: Partial<RolePermission>) {
        super(data);
    }
}

export interface RolePermissionRelations {
    // describe navigational properties here
}

export type RolePermissionWithRelations = RolePermission &
    RolePermissionRelations;
