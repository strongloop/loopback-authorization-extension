import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    BelongsToAccessor,
    HasManyRepositoryFactory,
    DefaultCrudRepository
} from "@loopback/repository";
import { Ctor, HistoryCrudRepositoryMixin } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { Role, RoleRelations, UserRole, RolePermission } from "../models";

import { DefaultUserRoleRepository, DefaultRolePermissionRepository } from "./";

export function RoleRepositoryMixin<
    Model extends Role,
    ModelRelations extends RoleRelations
>(): Class<DefaultCrudRepository<Model, string, ModelRelations>> {
    @bindAuthorization("RoleRepository")
    class RoleRepository extends HistoryCrudRepositoryMixin<
        Model,
        ModelRelations
    >() {
        public readonly parent: BelongsToAccessor<
            Role,
            typeof Role.prototype.id
        >;

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
            getUserRoleRepository: Getter<DefaultUserRoleRepository>,
            @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
            getRolePermissionRepository: Getter<DefaultRolePermissionRepository>
        ) {
            super(ctor, dataSource);

            this.parent = this.createBelongsToAccessorFor(
                "parent",
                Getter.fromValue(this)
            );
            this.registerInclusionResolver(
                "parent",
                this.parent.inclusionResolver
            );

            this.childs = this.createHasManyRepositoryFactoryFor(
                "childs",
                Getter.fromValue(this)
            );
            this.registerInclusionResolver(
                "childs",
                this.childs.inclusionResolver
            );

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

    return RoleRepository;
}

export class DefaultRoleRepository extends RoleRepositoryMixin<
    Role,
    RoleRelations
>() {}
