import { BindingKey, MetadataAccessor, bind, inject } from "@loopback/context";
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
    PermissionRepository
} from "./repositories";

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
     * DataSource key
     *
     * 1. RDBMS
     */
    export const DATASOURCE = BindingKey.create<juggler.DataSource>(
        "authorization.dataSources.rdbms"
    );

    /**
     * Repository key:
     *
     * 1. UserModel
     * 2. GroupModel
     * 3. RoleModel
     * 4. PermissionModel
     */
    export const USER_MODEL = BindingKey.create<Ctor<User>>(
        "authorization.models.user"
    );
    export const GROUP_MODEL = BindingKey.create<Ctor<Group>>(
        "authorization.models.group"
    );
    export const ROLE_MODEL = BindingKey.create<Ctor<Role>>(
        "authorization.models.role"
    );
    export const PERMISSION_MODEL = BindingKey.create<Ctor<Permission>>(
        "authorization.models.permission"
    );

    /**
     * Repository key:
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
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata<PermissionsList>,
    MethodDecorator
>("authorization.operationsMetadata");

/**
 * DataSource key
 *
 * 1. RDBMS
 */
export function bindRDBMSDataSource() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ dataSource: true });
        binding.tag({ rdbms: true });

        return binding;
    });
}
export function injectRDBMSDataSource() {
    return inject(
        binding =>
            binding.tagMap.authorization &&
            binding.tagMap.dataSource &&
            binding.tagMap.rdbms
    );
}

/**
 * Repository inject, bind tag setter, getter
 *
 * 1. UserRepository
 * 2. GroupRepository
 * 3. RoleRepository
 * 4. PermissionRepository
 */
export function bindUserRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ repository: true });
        binding.tag({ user: true });

        return binding;
    });
}
export function injectUserRepository() {
    return inject(
        binding =>
            binding.tagMap.authorization &&
            binding.tagMap.repository &&
            binding.tagMap.user
    );
}
export function bindGroupRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ repository: true });
        binding.tag({ group: true });

        return binding;
    });
}
export function injectGroupRepository() {
    return inject(
        binding =>
            binding.tagMap.authorization &&
            binding.tagMap.repository &&
            binding.tagMap.group
    );
}
export function bindRoleRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ repository: true });
        binding.tag({ role: true });

        return binding;
    });
}
export function injectRoleRepository() {
    return inject(
        binding =>
            binding.tagMap.authorization &&
            binding.tagMap.repository &&
            binding.tagMap.role
    );
}
export function bindPermissionRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ repository: true });
        binding.tag({ permission: true });

        return binding;
    });
}
export function injectPermissionRepository() {
    return inject(
        binding =>
            binding.tagMap.authorization &&
            binding.tagMap.repository &&
            binding.tagMap.permission
    );
}
