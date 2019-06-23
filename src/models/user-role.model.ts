import { Entity, model, property, belongsTo } from "@loopback/repository";

@model()
export class UserRole<
    UserModel extends Entity,
    RoleModel extends Entity
> extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => UserModel, { keyTo: "id" })
    user: UserModel;

    @belongsTo(() => RoleModel, { keyTo: "id" })
    role: RoleModel;

    constructor(data?: Partial<UserRole<UserModel, RoleModel>>) {
        super(data);
    }
}
