import { model } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class User extends HistoryEntity {
    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations;
