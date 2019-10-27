import { model, property } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class Permission extends HistoryEntity {
    @property({
        type: "string",
        required: true,
        index: {
            unique: true
        }
    })
    key: keyof Permissions;

    constructor(data?: Partial<Permission>) {
        super(data);
    }
}

export interface PermissionRelations {}

export type PermissionWithRelations = Permission & PermissionRelations;
