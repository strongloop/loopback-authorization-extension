import { Entity, model, property, belongsTo } from "@loopback/repository";

@model()
export class Role extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => Role, { keyTo: "id" })
    parent: Role;
}
