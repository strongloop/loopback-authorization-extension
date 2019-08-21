import { Entity, model, property, belongsTo } from "@loopback/repository";

@model({ settings: {} })
export class RoleModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => RoleModel)
    parent: string;

    constructor(data?: Partial<RoleModel>) {
        super(data);
    }
}

export interface RoleModelRelations {
    // describe navigational properties here
}

export type RoleModelWithRelations = RoleModel & RoleModelRelations;
