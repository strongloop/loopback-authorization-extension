import { Getter, bind } from "@loopback/core";
import { DefaultCrudRepository, BelongsToAccessor } from "@loopback/repository";

import { AuthorizationDataSource, injectDataSource } from "../datasources";
import {
    GroupRoleModel,
    GroupRoleModelRelations,
    GroupModel,
    GroupModelRelations,
    RoleModel,
    RoleModelRelations
} from "../models";
import {
    GroupModelRepository,
    injectGroupRepositoryGetter,
    RoleModelRepository,
    injectRoleRepositoryGetter
} from "./";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "GroupRole" });

    return binding;
})
export class GroupRoleModelRepository extends DefaultCrudRepository<
    GroupRoleModel,
    typeof GroupRoleModel.prototype.id,
    GroupRoleModelRelations
> {
    public readonly groupModel: BelongsToAccessor<
        GroupModel,
        typeof GroupRoleModel.prototype.id
    >;

    public readonly roleModel: BelongsToAccessor<
        RoleModel,
        typeof GroupRoleModel.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: AuthorizationDataSource,
        @injectGroupRepositoryGetter()
        groupModelRepositoryGetter: Getter<
            GroupModelRepository<GroupModel, GroupModelRelations>
        >,
        @injectRoleRepositoryGetter()
        roleModelRepositoryGetter: Getter<
            RoleModelRepository<RoleModel, RoleModelRelations>
        >
    ) {
        super(GroupRoleModel, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "role",
            roleModelRepositoryGetter
        );
        this.groupModel = this.createBelongsToAccessorFor(
            "group",
            groupModelRepositoryGetter
        );
    }
}
