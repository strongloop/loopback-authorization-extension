import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    BelongsToAccessor,
    DefaultCrudRepository
} from "@loopback/repository";
import { Ctor, HistoryCrudRepositoryMixin } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import {
    RolePermission,
    RolePermissionRelations,
    Role,
    Permission
} from "../models";

import { DefaultRoleRepository, DefaultPermissionRepository } from "./";

export function RolePermissionRepositoryMixin<
    Model extends RolePermission,
    ModelRelations extends RolePermissionRelations
>(): Class<DefaultCrudRepository<Model, string, ModelRelations>> {
    @bindAuthorization("RolePermissionRepository")
    class RolePermissionRepository extends HistoryCrudRepositoryMixin<
        Model,
        ModelRelations
    >() {
        public readonly role: BelongsToAccessor<
            Role,
            typeof RolePermission.prototype.id
        >;
        public readonly permission: BelongsToAccessor<
            Permission,
            typeof RolePermission.prototype.id
        >;
        constructor(
            @inject(PrivateAuthorizationBindings.ROLE_PERMISSION_MODEL)
            ctor: Ctor<Model>,
            @inject(PrivateAuthorizationBindings.DATASOURCE)
            dataSource: juggler.DataSource,
            @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
            getRoleRepository: Getter<DefaultRoleRepository>,
            @inject.getter(AuthorizationBindings.PERMISSION_REPOSITORY)
            getPermissionRepository: Getter<DefaultPermissionRepository>
        ) {
            super(ctor, dataSource);
            this.role = this.createBelongsToAccessorFor(
                "role",
                getRoleRepository
            );
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

    return RolePermissionRepository;
}

export class DefaultRolePermissionRepository extends RolePermissionRepositoryMixin<
    RolePermission,
    RolePermissionRelations
>() {}
