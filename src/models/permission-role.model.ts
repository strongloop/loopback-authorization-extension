import { Entity, model, property, belongsTo } from "@loopback/repository";

@model()
export class PermissionRole<
    PermissionModel extends Entity,
    RoleModel extends Entity
> extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => PermissionModel, { keyTo: "id" })
    permission: PermissionModel;

    @belongsTo(() => RoleModel, { keyTo: "id" })
    role: RoleModel;

    constructor(data?: Partial<PermissionRole<PermissionModel, RoleModel>>) {
        super(data);
    }
}
