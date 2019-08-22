import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import {
    injectDataSource,
    injectRoleRepository,
    injectPermissionRepository
} from "../keys";
import {
    RolePermissionModel,
    RolePermissionModelRelations,
    RoleModel,
    RoleModelRelations,
    PermissionModel,
    PermissionModelRelations
} from "../models";
import { RoleModelRepository, PermissionModelRepository } from "./";

export class RolePermissionModelRepository extends DefaultCrudRepository<
    RolePermissionModel,
    typeof RolePermissionModel.prototype.id,
    RolePermissionModelRelations
> {
    public readonly role: BelongsToAccessor<
        RoleModel,
        typeof RolePermissionModel.prototype.id
    >;

    public readonly permission: BelongsToAccessor<
        PermissionModel,
        typeof RolePermissionModel.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectRoleRepository()
        roleModelRepository: RoleModelRepository<
            RoleModel,
            RoleModelRelations
        >[],
        @injectPermissionRepository()
        permissionModelRepository: PermissionModelRepository<
            PermissionModel,
            PermissionModelRelations
        >[]
    ) {
        super(RolePermissionModel, dataSource[0]);

        this.role = this.createBelongsToAccessorFor(
            "role",
            async () => roleModelRepository[0]
        );
        this.permission = this.createBelongsToAccessorFor(
            "permission",
            async () => permissionModelRepository[0]
        );
    }
}
