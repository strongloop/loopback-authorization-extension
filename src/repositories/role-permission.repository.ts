import { inject, Getter } from "@loopback/context";
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
import { RoleRepository, PermissionRepository } from "../repositories";

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
        @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
        getRoleRepository: Getter<RoleRepository<Role, RoleRelations>>,
        @inject.getter(AuthorizationBindings.PERMISSION_REPOSITORY)
        getPermissionRepository: Getter<
            PermissionRepository<Permission, PermissionRelations>
        >
    ) {
        super(RolePermission, dataSource);

        this.role = this.createBelongsToAccessorFor("role", getRoleRepository);
        this.registerInclusionResolver("role", this.role.inclusionResolver);

        this.permission = this.createBelongsToAccessorFor(
            "permission",
            getPermissionRepository
        );
        this.registerInclusionResolver(
            "permission",
            this.permission.inclusionResolver
        );
    }
}
