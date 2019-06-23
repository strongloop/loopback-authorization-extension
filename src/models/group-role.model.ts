import { Entity, model, property, belongsTo } from "@loopback/repository";

@model()
export class GroupRole<
    GroupModel extends Entity,
    RoleModel extends Entity
> extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => ctor, { keyTo: "id" })
    group: GroupModel;

    @belongsTo(() => RoleModel, { keyTo: "id" })
    role: RoleModel;

    constructor(data?: Partial<GroupRole<GroupModel, RoleModel>>) {
        super(data);
    }
}
