import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import {
    injectDataSource,
    injectUserRepository,
    injectRoleRepository
} from "../keys";
import {
    UserRoleModel,
    UserRoleModelRelations,
    UserModel,
    UserModelRelations,
    RoleModel,
    RoleModelRelations
} from "../models";
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
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectUserRepository()
        userModelRepository: UserModelRepository<
            UserModel,
            UserModelRelations
        >[],
        @injectRoleRepository()
        roleModelRepository: RoleModelRepository<
            RoleModel,
            RoleModelRelations
        >[]
    ) {
        super(UserRoleModel, dataSource[0]);

        this.userModel = this.createBelongsToAccessorFor(
            "user",
            async () => userModelRepository[0]
        );
        this.roleModel = this.createBelongsToAccessorFor(
            "role",
            async () => roleModelRepository[0]
        );
    }
}
