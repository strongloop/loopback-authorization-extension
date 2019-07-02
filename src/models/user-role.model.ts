import {
    Entity,
    model,
    property,
    belongsTo,
    Constructor
} from "@loopback/repository";

@model()
class UserRoleModel<
    UserModel extends Entity,
    RoleModel extends Entity
> extends Entity {
    id: string;
    user: UserModel;
    role: RoleModel;

    constructor(data?: Partial<UserRoleModel<UserModel, RoleModel>>) {
        super(data);
    }
}

export function UserRole<UserModel extends Entity, RoleModel extends Entity>(
    userModelCtor: typeof Entity & { prototype: any },
    roleModelCtor: typeof Entity & { prototype: any }
): UserRoleModel<UserModel, RoleModel> {
    @model()
    class MyUserRoleModel extends Entity {
        @property({
            type: "string",
            unique: true,
            id: true
        })
        id: string;

        @belongsTo(() => userModelCtor, { keyTo: "id" })
        user: UserModel;

        @belongsTo(() => roleModelCtor, { keyTo: "id" })
        role: RoleModel;

        constructor(data?: Partial<MyUserRoleModel>) {
            super(data);
        }
    }

    return MyUserRoleModel;
}
