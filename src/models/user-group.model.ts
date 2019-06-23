import { Entity, model, property, belongsTo } from "@loopback/repository";

@model()
export class UserGroup<
    UserModel extends Entity,
    GroupModel extends Entity
> extends Entity {
    @property({
        type: "string",
        unique: true,
        id: true
    })
    id: string;

    @belongsTo(() => UserModel, { keyTo: "id" })
    user: UserModel;

    @belongsTo(() => GroupModel, { keyTo: "id" })
    group: GroupModel;

    constructor(data?: Partial<UserGroup<UserModel, GroupModel>>) {
        super(data);
    }
}
