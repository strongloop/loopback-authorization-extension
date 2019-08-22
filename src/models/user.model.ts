import { Entity, model, property } from "@loopback/repository";

@model({ settings: {} })
export class User extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
