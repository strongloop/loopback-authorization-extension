import { inject } from "@loopback/context";
import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { PrivateAuthorizationBindings, AuthorizationBindings } from "../keys";

import {
    RolePermission,
    RolePermissionRelations,
    Role,
    RoleRelations,
    Permission,
    PermissionRelations
} from "../models";
import { RoleRepository, PermissionRepository } from ".";

export class RolePermissionRepository extends HistoryCrudRepository<
    RolePermission,
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
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject(AuthorizationBindings.ROLE_REPOSITORY)
        roleRepository: RoleRepository<Role, RoleRelations>,
        @inject(AuthorizationBindings.PERMISSION_REPOSITORY)
        permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >
    ) {
        super(RolePermission, dataSource);

        this.role = this.createBelongsToAccessorFor(
            "role",
            async () => roleRepository
        );
        this.permission = this.createBelongsToAccessorFor(
            "permission",
            async () => permissionRepository
        );
    }
}
