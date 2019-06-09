import { Entity, model, property, belongsTo } from "@loopback/repository";

import { User, Group } from "./";

@model()
export class UserGroup extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => User, { keyTo: "id" })
    user: User;

    @belongsTo(() => Group, { keyTo: "id" })
    group: Group;

    constructor(data?: Partial<UserGroup>) {
        super(data);
    }
}
