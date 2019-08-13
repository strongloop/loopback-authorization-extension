import { BindingKey, MetadataAccessor } from "@loopback/context";
import { juggler } from "@loopback/repository";

import {
    UserModel,
    UserModelRelations,
    GroupModel,
    GroupModelRelations,
    RoleModel,
    RoleModelRelations,
    PermissionModel,
    PermissionModelRelations
} from "./models";
import {
    UserModelRepository,
    GroupModelRepository,
    RoleModelRepository,
    PermissionModelRepository,
    UserGroupModelRepository,
    UserRoleModelRepository,
    GroupRoleModelRepository,
    RolePermissionModelRepository
} from "./repositories";

import { AuthorizeFn, GetUserPermissionsFn } from "./types";
import { AuthorizationMetadata } from "./decorators";

export namespace AuthorizationBindings {
    /**
     * DataSource key: input
     *  1. DataSource extends juggler.DataSource
     *
     */
    export const DATASOURCE = BindingKey.create<juggler.DataSource>(
        "authorization.datasources.datasource"
    );

    /**
     * Base Repositories keys: input (clients repo class, extends our base class)
     *  1. UserModelRepository
     *  2. GroupModelRepository
     *  3. RoleModelRepository
     *  4. PermissionModelRepository
     *
     */
    export const USER_REPOSITORY = BindingKey.create<
        UserModelRepository<UserModel, UserModelRelations>
    >("authorization.repositories.user");
    export const GROUP_REPOSITORY = BindingKey.create<
        GroupModelRepository<GroupModel, GroupModelRelations>
    >("authorization.repositories.group");
    export const ROLE_REPOSITORY = BindingKey.create<
        RoleModelRepository<RoleModel, RoleModelRelations>
    >("authorization.repositories.role");
    export const PERMISSION_REPOSITORY = BindingKey.create<
        PermissionModelRepository<PermissionModel, PermissionModelRelations>
    >("authorization.repositories.permission");

    /**
     * Advance Repositories keys: output (model relations: many-to-many)
     *  1. UserGroupModelRepository
     *  2. UserRoleModelRepository
     *  3. GroupRoleModelRepository
     *  4. RolePermissionModelRepository
     *
     */
    export const USER_GROUP_REPOSITORY = BindingKey.create<
        UserGroupModelRepository
    >("authorization.repositories.user_group");
    export const USER_ROLE_REPOSITORY = BindingKey.create<
        UserRoleModelRepository
    >("authorization.repositories.user_role");
    export const GROUP_ROLE_REPOSITORY = BindingKey.create<
        GroupRoleModelRepository
    >("authorization.repositories.group_role");
    export const ROLE_PERMISSION_REPOSITORY = BindingKey.create<
        RolePermissionModelRepository
    >("authorization.repositories.role_permission");

    /**
     * Action Provider key: output
     *  1. AuthorizeFn
     *  2. GetUserPermissionsFn
     *
     */
    export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
        "authorization.providers.authorize"
    );
    export const GET_USER_PERMISSIONS_ACTION = BindingKey.create<
        GetUserPermissionsFn
    >("authorization.providers.getUserPermissions");
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata,
    MethodDecorator
>("authorization.operationsMetadata");
