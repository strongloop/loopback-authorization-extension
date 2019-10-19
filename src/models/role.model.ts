import { model, belongsTo } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class Role extends HistoryEntity {
    @belongsTo(() => Role)
    parentId: string;

    constructor(data?: Partial<Role>) {
        super(data);
    }
}

export interface RoleRelations {
    parent: RoleWithRelations;
}

export type RoleWithRelations = Role & RoleRelations;
