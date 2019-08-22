import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User, Role } from ".";

@model({ settings: {} })
export class UserRole extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => User)
    user: string;

    @belongsTo(() => Role)
    role: string;

    constructor(data?: Partial<UserRole>) {
        super(data);
    }
}

export interface UserRoleRelations {
    // describe navigational properties here
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
