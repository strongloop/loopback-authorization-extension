import {
    DefaultCrudRepository,
    repository,
    BelongsToAccessor
} from "@loopback/repository";
import {
    UserRoleModel,
    UserRoleModelRelations,
    UserModel,
    RoleModel
} from "../models";
import { MySqlDataSource } from "../datasources";
import { inject, Getter } from "@loopback/core";
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
        @inject("datasources.MySQL") dataSource: MySqlDataSource,
        @repository.getter("UserModelRepository")
        protected userModelRepositoryGetter: Getter<UserModelRepository>,
        @repository.getter("RoleModelRepository")
        protected roleModelRepositoryGetter: Getter<RoleModelRepository>
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
