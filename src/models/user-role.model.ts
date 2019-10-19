import { model, belongsTo } from "@loopback/repository";
import { User, UserWithRelations, Role, RoleWithRelations } from ".";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class UserRole extends HistoryEntity {
    @belongsTo(() => User)
    userId: string;

    @belongsTo(() => Role)
    roleId: string;

    constructor(data?: Partial<UserRole>) {
        super(data);
    }
}

export interface UserRoleRelations {
    user: UserWithRelations;
    role: RoleWithRelations;
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
