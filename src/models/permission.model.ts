import { Entity, model, property } from "@loopback/repository";

@model()
export class Permission extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;
}
