import { model, belongsTo } from "@loopback/repository";
import { User, UserWithRelations, Group, GroupWithRelations } from "./";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class UserGroup extends HistoryEntity {
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
