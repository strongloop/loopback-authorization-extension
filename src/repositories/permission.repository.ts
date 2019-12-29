import { inject, Getter } from "@loopback/context";
import {
    juggler,
    HasManyRepositoryFactory,
    DefaultCrudRepository
} from "@loopback/repository";
import { Ctor } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import {
    Permission,
    PermissionRelations,
    RolePermission,
    RolePermissionRelations
} from "../models";

import { RolePermissionRepository } from "./";

@bindAuthorization("PermissionRepository")
export class PermissionRepository<
    Model extends Permission,
    ModelRelations extends PermissionRelations
> extends DefaultCrudRepository<Model, string, ModelRelations> {
    public readonly rolePermissions: HasManyRepositoryFactory<
        RolePermission,
        typeof Permission.prototype.id
    >;

    constructor(
        @inject(PrivateAuthorizationBindings.PERMISSION_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
        getRolePermissionRepository: Getter<
            RolePermissionRepository<RolePermission, RolePermissionRelations>
        >
    ) {
        super(ctor, dataSource);

        this.rolePermissions = this.createHasManyRepositoryFactoryFor(
            "rolePermissions",
            getRolePermissionRepository
        );
        this.registerInclusionResolver(
            "rolePermissions",
            this.rolePermissions.inclusionResolver
        );
    }
}
