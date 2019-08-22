import { Getter, bind } from "@loopback/core";
import { DefaultCrudRepository, BelongsToAccessor } from "@loopback/repository";

import { AuthorizationDataSource, injectDataSource } from "../datasources";
import {
    UserRoleModel,
    UserRoleModelRelations,
    UserModel,
    UserModelRelations,
    RoleModel,
    RoleModelRelations
} from "../models";
import {
    UserModelRepository,
    injectUserRepositoryGetter,
    RoleModelRepository,
    injectRoleRepositoryGetter
} from "./";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "UserRole" });

    return binding;
})
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
        @injectDataSource()
        dataSource: AuthorizationDataSource,
        @injectUserRepositoryGetter()
        userModelRepositoryGetter: Getter<
            UserModelRepository<UserModel, UserModelRelations>
        >,
        @injectRoleRepositoryGetter()
        roleModelRepositoryGetter: Getter<
            RoleModelRepository<RoleModel, RoleModelRelations>
        >
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
