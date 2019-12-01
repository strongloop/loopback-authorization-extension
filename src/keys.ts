import { Context, BindingKey, MetadataAccessor, bind } from "@loopback/context";
import { Ctor } from "loopback-history-extension";
import { juggler } from "@loopback/repository";

import { PermissionsList, AuthorizeFn, GetUserPermissionsFn } from "./types";
import { AuthorizationMetadata } from "./decorators";

import {
    User,
    UserRelations,
    Group,
    GroupRelations,
    Role,
    RoleRelations,
    Permission,
    PermissionRelations
} from "./models";
import {
    UserRepository,
    GroupRepository,
    RoleRepository,
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "./repositories";

/**
 * Private binding used in component scope
 */
export namespace PrivateAuthorizationBindings {
    /**
     * Model key:
     *
     * 1. UserModel
     * 2. GroupModel
     * 3. RoleModel
     * 4. PermissionModel
     */
    export const USER_MODEL = BindingKey.create<Ctor<User>>(
        "private.authorization.models.user"
    );
    export const GROUP_MODEL = BindingKey.create<Ctor<Group>>(
        "private.authorization.models.group"
    );
    export const ROLE_MODEL = BindingKey.create<Ctor<Role>>(
        "private.authorization.models.role"
    );
    export const PERMISSION_MODEL = BindingKey.create<Ctor<Permission>>(
        "private.authorization.models.permission"
    );

    /**
     * DataSource key
     *
     * 1. DataSource: RDBMS
     */
    export const DATASOURCE = BindingKey.create<juggler.DataSource>(
        "private.authorization.dataSources.dataSource"
    );
}

/**
 * Public bindings used in application scope
 */
export namespace AuthorizationBindings {
    /**
     * Action Provider key: output
     *  1. AuthorizeFn
     *  2. GetUserPermissionsFn
     *
     */
    export const AUTHORIZE_ACTION = BindingKey.create<
        AuthorizeFn<PermissionsList>
    >("authorization.providers.authorize");
    export const GET_USER_PERMISSIONS_ACTION = BindingKey.create<
        GetUserPermissionsFn<PermissionsList>
    >("authorization.providers.getUserPermissions");

    /**
     * Base Repository key:
     *
     * 1. UserRepository
     * 2. GroupRepository
     * 3. RoleRepository
     * 4. PermissionRepository
     */
    export const USER_REPOSITORY = BindingKey.create<
        UserRepository<User, UserRelations>
    >("authorization.repositories.user");
    export const GROUP_REPOSITORY = BindingKey.create<
        GroupRepository<Group, GroupRelations>
    >("authorization.repositories.group");
    export const ROLE_REPOSITORY = BindingKey.create<
        RoleRepository<Role, RoleRelations>
    >("authorization.repositories.role");
    export const PERMISSION_REPOSITORY = BindingKey.create<
        PermissionRepository<Permission, PermissionRelations>
    >("authorization.repositories.permission");

    /**
     * Relation Repository key:
     *
     * 1. UserGroupRepository
     * 2. UserRoleRepository
     * 3. GroupRoleRepository
     * 4. RolePermissionRepository
     */
    export const USER_GROUP_REPOSITORY = BindingKey.create<UserGroupRepository>(
        "authorization.repositories.userGroup"
    );
    export const USER_ROLE_REPOSITORY = BindingKey.create<UserRoleRepository>(
        "authorization.repositories.userRole"
    );
    export const GROUP_ROLE_REPOSITORY = BindingKey.create<GroupRoleRepository>(
        "authorization.repositories.groupRole"
    );
    export const ROLE_PERMISSION_REPOSITORY = BindingKey.create<
        RolePermissionRepository
    >("authorization.repositories.rolePermission");
}
export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata<PermissionsList>,
    MethodDecorator
>("authorization.operationsMetadata");

/**
 * Binding, Finding key
 *
 * 1. DataSource
 *
 * 2. UserRepository
 * 3. GroupRepository
 * 4. RoleRepository
 * 5. PermissionRepository
 */
export type BindAuthorizationKey =
    | "DataSource"
    | "UserRepository"
    | "GroupRepository"
    | "RoleRepository"
    | "PermissionRepository";
export function bindAuthorization(key: BindAuthorizationKey) {
    return bind(binding => {
        binding.tag({
            authorization: true,
            authorizationKey: key
        });

        return binding;
    });
}
export function findAuthorization(ctx: Context, key: BindAuthorizationKey) {
    const binding = ctx.findByTag({
        authorization: true,
        authorizationKey: key
    })[0];

    if (binding) {
        return binding.getValue(ctx);
    }
}
