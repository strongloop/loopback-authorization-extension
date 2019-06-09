import { Entity, model, property, belongsTo } from "@loopback/repository";

@model()
export class Group extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => Group, { keyTo: "id" })
    parent: Group;
}
