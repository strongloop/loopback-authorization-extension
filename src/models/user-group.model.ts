import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User, UserWithRelations, Group, GroupWithRelations } from ".";

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
    userId: string;

    @belongsTo(() => Group)
    groupId: string;

    constructor(data?: Partial<UserGroup>) {
        super(data);
    }
}

export interface UserGroupRelations {
    user: UserWithRelations;
    group: GroupWithRelations;
}

export type UserGroupWithRelations = UserGroup & UserGroupRelations;
