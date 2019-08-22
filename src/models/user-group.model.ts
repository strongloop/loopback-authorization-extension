import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User, Group } from ".";

@model({ settings: {} })
export class UserGroup extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => User)
    user: string;

    @belongsTo(() => Group)
    group: string;

    constructor(data?: Partial<UserGroup>) {
        super(data);
    }
}

export interface UserGroupRelations {
    // describe navigational properties here
}

export type UserGroupWithRelations = UserGroup & UserGroupRelations;
