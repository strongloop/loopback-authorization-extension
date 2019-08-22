import { Entity, model, property, belongsTo } from "@loopback/repository";

@model({ settings: {} })
export class Role extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => Role)
    parent: string;

    constructor(data?: Partial<Role>) {
        super(data);
    }
}

export interface RoleRelations {
    // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
