import { Entity, model, property, belongsTo } from "@loopback/repository";

import { User, Role } from "./";

@model()
export class UserRole extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => User, { keyTo: "id" })
    user: User;

    @belongsTo(() => Role, { keyTo: "id" })
    role: Role;
}
