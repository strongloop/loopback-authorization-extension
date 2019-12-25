import { model, hasMany } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

import { UserRole, UserRoleWithRelations } from "./";

@model({ settings: {} })
export class User extends HistoryEntity {
    @hasMany(() => UserRole, { keyFrom: "", keyTo: "userId" })
    userRoles: UserRoleWithRelations[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;
