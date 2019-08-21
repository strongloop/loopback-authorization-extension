import { Entity, model, property, belongsTo } from "@loopback/repository";
import { UserModel, GroupModel } from "./";

@model({ settings: {} })
export class UserGroupModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => UserModel)
    user: string;

    @belongsTo(() => GroupModel)
    group: string;

    constructor(data?: Partial<UserGroupModel>) {
        super(data);
    }
}

export interface UserGroupModelRelations {
    // describe navigational properties here
}

export type UserGroupModelWithRelations = UserGroupModel &
    UserGroupModelRelations;
