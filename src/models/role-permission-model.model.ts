import { Entity, model, property, belongsTo } from "@loopback/repository";
import { RoleModel, PermissionModel } from "./";

@model({ settings: {} })
export class RolePermissionModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true
    })
    id: string;

    @belongsTo(() => RoleModel)
    role: string;

    @belongsTo(() => PermissionModel)
    permission: string;

    constructor(data?: Partial<RolePermissionModel>) {
        super(data);
    }
}

export interface RolePermissionModelRelations {
    // describe navigational properties here
}

export type RolePermissionModelWithRelations = RolePermissionModel &
    RolePermissionModelRelations;
