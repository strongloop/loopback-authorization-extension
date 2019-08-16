import { Entity, model, property, belongsTo } from "@loopback/repository";

@model({ settings: {} })
export class GroupModel extends Entity {
    @property({
        type: "string",
        id: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => GroupModel)
    parent: string;

    constructor(data?: Partial<GroupModel>) {
        super(data);
    }
}

export interface GroupModelRelations {
    // describe navigational properties here
}

export type GroupModelWithRelations = GroupModel & GroupModelRelations;
