import { model, hasMany } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

import { UserRole } from "./";

@model({ settings: {} })
export class User extends HistoryEntity {
    @hasMany(() => UserRole, { keyTo: "userId" })
    userRoles: UserRole[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;
