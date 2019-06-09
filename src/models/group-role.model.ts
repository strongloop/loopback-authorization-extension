import { Entity, model, property, belongsTo } from "@loopback/repository";

import { Group, Role } from "./";

@model()
export class GroupRole extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => Group, { keyTo: "id" })
    group: Group;

    @belongsTo(() => Role, { keyTo: "id" })
    role: Role;

    constructor(data?: Partial<GroupRole>) {
        super(data);
    }
}
