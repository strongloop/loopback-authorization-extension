import { BindingKey, MetadataAccessor } from "@loopback/context";
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
