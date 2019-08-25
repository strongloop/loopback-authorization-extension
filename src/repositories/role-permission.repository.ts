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
    RolePermission,
    RolePermissionRelations,
    Role,
    RoleRelations,
    Permission,
    PermissionRelations
} from "../models";
import { RoleRepository, PermissionRepository } from ".";

export class RolePermissionRepository extends DefaultCrudRepository<
    RolePermission,
    typeof RolePermission.prototype.id,
    RolePermissionRelations
> {
    public readonly role: BelongsToAccessor<
        Role,
        typeof RolePermission.prototype.id
    >;

    public readonly permission: BelongsToAccessor<
        Permission,
        typeof RolePermission.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectRoleRepository()
        roleRepository: RoleRepository<Role, RoleRelations>[],
        @injectPermissionRepository()
        permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >[]
    ) {
        super(RolePermission, dataSource[0]);

        this.role = this.createBelongsToAccessorFor(
            "roleId",
            async () => roleRepository[0]
        );
        this.permission = this.createBelongsToAccessorFor(
            "permissionId",
            async () => permissionRepository[0]
        );
    }
}
