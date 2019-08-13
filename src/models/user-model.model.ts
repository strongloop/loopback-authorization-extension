import { Entity, model, property } from "@loopback/repository";

@model({ settings: {} })
export class UserModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true
    })
    id: string;

    constructor(data?: Partial<UserModel>) {
        super(data);
    }
}

export interface UserModelRelations {
    // describe navigational properties here
}

export type UserModelWithRelations = UserModel & UserModelRelations;
