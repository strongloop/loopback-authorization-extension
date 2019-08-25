import { Entity, model, property, belongsTo } from "@loopback/repository";
import { User, UserWithRelations, Role, RoleWithRelations } from ".";

@model({ settings: {} })
export class UserRole extends Entity {
    @property({
        type: "string",
        id: true,
        required: true,
        defaultFn: "uuidv4"
    })
    id: string;

    @belongsTo(() => User)
    userId: string;

    @belongsTo(() => Role)
    roleId: string;

    constructor(data?: Partial<UserRole>) {
        super(data);
    }
}

export interface UserRoleRelations {
    user: UserWithRelations;
    role: RoleWithRelations;
}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
