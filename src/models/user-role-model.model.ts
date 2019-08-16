import { Entity, model, property, belongsTo } from "@loopback/repository";
import { UserModel, RoleModel } from "./";

@model({ settings: {} })
export class UserRoleModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => UserModel)
    user: string;

    @belongsTo(() => RoleModel)
    role: string;

    constructor(data?: Partial<UserRoleModel>) {
        super(data);
    }
}

export interface UserRoleModelRelations {
    // describe navigational properties here
}

export type UserRoleModelWithRelations = UserRoleModel & UserRoleModelRelations;
