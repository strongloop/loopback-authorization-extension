import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    HasManyRepositoryFactory,
    DefaultCrudRepository
} from "@loopback/repository";
import { Ctor } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { Permission, PermissionRelations, RolePermission } from "../models";

import { DefaultRolePermissionRepository } from "./";

export function PermissionRepositoryMixin<
    Model extends Permission,
    ModelRelations extends PermissionRelations
>(): Class<DefaultCrudRepository<Model, string, ModelRelations>> {
    @bindAuthorization("PermissionRepository")
    class PermissionRepository extends DefaultCrudRepository<
        Model,
        string,
        ModelRelations
    > {
        public readonly rolePermissions: HasManyRepositoryFactory<
            RolePermission,
            typeof Permission.prototype.id
        >;

        constructor(
            @inject(PrivateAuthorizationBindings.PERMISSION_MODEL)
            ctor: Ctor<Model>,
            @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
            dataSource: juggler.DataSource,
            @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
            getRolePermissionRepository: Getter<DefaultRolePermissionRepository>
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

    return PermissionRepository;
}

export class DefaultPermissionRepository extends PermissionRepositoryMixin<
    Permission,
    PermissionRelations
>() {}
