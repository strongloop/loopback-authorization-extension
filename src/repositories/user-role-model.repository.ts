import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";
import {
    UserRoleModel,
    UserRoleModelRelations,
    UserModel,
    RoleModel
} from "../models";
import { Getter } from "@loopback/core";
import { UserModelRepository, RoleModelRepository } from "./";

export class UserRoleModelRepository extends DefaultCrudRepository<
    UserRoleModel,
    typeof UserRoleModel.prototype.id,
    UserRoleModelRelations
> {
    public readonly userModel: BelongsToAccessor<
        UserModel,
        typeof UserRoleModel.prototype.id
    >;

    public readonly roleModel: BelongsToAccessor<
        RoleModel,
        typeof UserRoleModel.prototype.id
    >;

    constructor(
        dataSource: juggler.DataSource,
        userModelRepositoryGetter: Getter<UserModelRepository>,
        roleModelRepositoryGetter: Getter<RoleModelRepository>
    ) {
        super(UserRoleModel, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "role",
            roleModelRepositoryGetter
        );
        this.userModel = this.createBelongsToAccessorFor(
            "user",
            userModelRepositoryGetter
        );
    }
}
