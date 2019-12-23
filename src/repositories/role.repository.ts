import { inject, Getter } from "@loopback/context";
import {
    juggler,
    BelongsToAccessor,
    HasManyRepositoryFactory
} from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { Role, RoleRelations, UserRole, RolePermission } from "../models";

import { UserRoleRepository, RolePermissionRepository } from "./";

@bindAuthorization("RoleRepository")
export class RoleRepository<
    Model extends Role,
    ModelRelations extends RoleRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly parent: BelongsToAccessor<Role, typeof Role.prototype.id>;
    public readonly userRoles: HasManyRepositoryFactory<
        UserRole,
        typeof Role.prototype.id
    >;
    public readonly rolePermissions: HasManyRepositoryFactory<
        RolePermission,
        typeof Role.prototype.id
    >;

    constructor(
        @inject(PrivateAuthorizationBindings.ROLE_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject.getter(AuthorizationBindings.USER_ROLE_REPOSITORY)
        getUserRoleRepository: Getter<UserRoleRepository>,
        @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
        getRolePermissionRepository: Getter<RolePermissionRepository>
    ) {
        super(ctor, dataSource);

        this.parent = this.createBelongsToAccessorFor(
            "parent",
            Getter.fromValue(this)
        );

        this.userRoles = this.createHasManyRepositoryFactoryFor(
            "userRoles",
            getUserRoleRepository
        );

        this.rolePermissions = this.createHasManyRepositoryFactoryFor(
            "rolePermissions",
            getRolePermissionRepository
        );
    }
}
