import { model, belongsTo } from "@loopback/repository";
import { HistoryEntity } from "loopback-history-extension";

@model({ settings: {} })
export class Group extends HistoryEntity {
    @belongsTo(() => Group)
    parentId: string;

    constructor(data?: Partial<Group>) {
        super(data);
    }
}

export interface GroupRelations {
    parent: GroupWithRelations;
}

export type GroupWithRelations = Group & GroupRelations;
