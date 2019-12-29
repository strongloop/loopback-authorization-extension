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

import {
    Role,
    RoleRelations,
    UserRole,
    UserRoleRelations,
    RolePermission,
    RolePermissionRelations
} from "../models";

import { UserRoleRepository, RolePermissionRepository } from "./";

@bindAuthorization("RoleRepository")
export class RoleRepository<
    Model extends Role,
    ModelRelations extends RoleRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly parent: BelongsToAccessor<Role, typeof Role.prototype.id>;
    public readonly childs: HasManyRepositoryFactory<
        Role,
        typeof Role.prototype.id
    >;
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
        getUserRoleRepository: Getter<
            UserRoleRepository<UserRole, UserRoleRelations>
        >,
        @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
        getRolePermissionRepository: Getter<
            RolePermissionRepository<RolePermission, RolePermissionRelations>
        >
    ) {
        super(ctor, dataSource);

        this.parent = this.createBelongsToAccessorFor(
            "parent",
            Getter.fromValue(this)
        );
        this.registerInclusionResolver("parent", this.parent.inclusionResolver);

        this.childs = this.createHasManyRepositoryFactoryFor(
            "childs",
            Getter.fromValue(this)
        );
        this.registerInclusionResolver("childs", this.childs.inclusionResolver);

        this.userRoles = this.createHasManyRepositoryFactoryFor(
            "userRoles",
            getUserRoleRepository
        );
        this.registerInclusionResolver(
            "userRoles",
            this.userRoles.inclusionResolver
        );

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
