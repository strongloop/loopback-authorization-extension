import { Entity, model, property } from "@loopback/repository";

@model({ settings: {} })
export class Permission extends Entity {
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

    constructor(data?: Partial<Permission>) {
        super(data);
    }
}

export interface PermissionRelations {
    // describe navigational properties here
}

export type PermissionWithRelations = Permission & PermissionRelations;
