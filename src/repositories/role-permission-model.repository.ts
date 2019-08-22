import { Getter, bind } from "@loopback/core";
import { DefaultCrudRepository, BelongsToAccessor } from "@loopback/repository";

import { AuthorizationDataSource, injectDataSource } from "../datasources";
import {
    RolePermissionModel,
    RolePermissionModelRelations,
    RoleModel,
    RoleModelRelations,
    PermissionModel,
    PermissionModelRelations
} from "../models";
import {
    RoleModelRepository,
    injectRoleRepositoryGetter,
    PermissionModelRepository,
    injectPermissionRepositoryGetter
} from "./";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "RolePermission" });

    return binding;
})
export class RolePermissionModelRepository extends DefaultCrudRepository<
    RolePermissionModel,
    typeof RolePermissionModel.prototype.id,
    RolePermissionModelRelations
> {
    public readonly roleModel: BelongsToAccessor<
        RoleModel,
        typeof RolePermissionModel.prototype.id
    >;

    public readonly permissionModel: BelongsToAccessor<
        PermissionModel,
        typeof RolePermissionModel.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: AuthorizationDataSource,
        @injectRoleRepositoryGetter()
        roleModelRepositoryGetter: Getter<
            RoleModelRepository<RoleModel, RoleModelRelations>
        >,
        @injectPermissionRepositoryGetter()
        permissionModelRepositoryGetter: Getter<
            PermissionModelRepository<PermissionModel, PermissionModelRelations>
        >
    ) {
        super(RolePermissionModel, dataSource);
        this.permissionModel = this.createBelongsToAccessorFor(
            "permission",
            permissionModelRepositoryGetter
        );
        this.roleModel = this.createBelongsToAccessorFor(
            "role",
            roleModelRepositoryGetter
        );
    }
}
