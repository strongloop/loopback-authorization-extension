import { Entity, model, property } from "@loopback/repository";

@model({ settings: {} })
export class PermissionModel extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @property({
        type: "string",
        required: true
    })
    key: string;

    constructor(data?: Partial<PermissionModel>) {
        super(data);
    }
}

export interface PermissionModelRelations {
    // describe navigational properties here
}

export type PermissionModelWithRelations = PermissionModel &
    PermissionModelRelations;
