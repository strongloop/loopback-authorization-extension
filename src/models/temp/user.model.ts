import { Entity, model, property } from "@loopback/repository";

@model()
export class User extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    constructor(data?: Partial<User>) {
        super(data);
    }
}
