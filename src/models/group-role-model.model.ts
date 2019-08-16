import { Entity, model, property, belongsTo } from "@loopback/repository";
import { GroupModel, RoleModel } from "./";

@model({ settings: {} })
export class GroupRoleModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => GroupModel)
    group: string;

    @belongsTo(() => RoleModel)
    role: string;

    constructor(data?: Partial<GroupRoleModel>) {
        super(data);
    }
}

export interface GroupRoleModelRelations {
    // describe navigational properties here
}

export type GroupRoleModelWithRelations = GroupRoleModel &
    GroupRoleModelRelations;
