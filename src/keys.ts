import { BindingKey, MetadataAccessor } from "@loopback/context";

import { Entity, juggler, Constructor } from "@loopback/repository";

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

import { AuthorizeFn } from "./types";
import { AuthorizationMetadata } from "./decorators";

export type UserModel = Constructor<Entity>;
export type GroupModel = Constructor<Entity>;
export type PermissionModel = Constructor<Entity>;
export type RoleModel = Constructor<Entity>;

export namespace AuthorizationBindings {
    /**
     * Generic Models keys: input
     *  1. UserModel extends Entity
     *  2. GroupModel extends Entity
     *  3. PermissionModel extends Entity
     *  4. RoleModel extends Entity
     *
     */
    export const USER_MODEL = BindingKey.create<UserModel>(
        "authorization.models.user"
    );
    export const GROUP_MODEL = BindingKey.create<GroupModel>(
        "authorization.models.group"
    );
    export const PERMISSION_MODEL = BindingKey.create<PermissionModel>(
        "authorization.models.permission"
    );
    export const ROLE_MODEL = BindingKey.create<RoleModel>(
        "authorization.models.role"
    );

    /**
     * DataSource key: input
     *  1. DataSource extends juggler.DataSource
     *
     */
    export const DATASOURCE = BindingKey.create<juggler.DataSource>(
        "authorization.datasources.datasource"
    );

    /**
     * Base Repositories keys: output
     *  1. UserRepository
     *  2. GroupRepository
     *  3. PermissionRepository
     *  4. RoleRepository
     *
     */
    export const USER_REPOSITORY = BindingKey.create<
        UserModelRepository<UserModel>
    >("authorization.repositories.user");
    export const GROUP_REPOSITORY = BindingKey.create<
        GroupModelRepository<GroupModel>
    >("authorization.repositories.group");
    export const PERMISSION_REPOSITORY = BindingKey.create<
        PermissionRepository<PermissionModel>
    >("authorization.repositories.permission");
    export const ROLE_REPOSITORY = BindingKey.create<
        RoleModelRepository<RoleModel>
    >("authorization.repositories.role");

    /**
     * Advance Repositories keys: output
     *  1. UserGroupRepository
     *  2. UserRoleRepository
     *  3. GroupRoleRepository
     *  4. PermissionRoleRepository
     *
     */
    export const USER_GROUP_REPOSITORY = BindingKey.create<
        UserGroupModelRepository<UserModel, GroupModel>
    >("authorization.repositories.user_group");
    export const USER_ROLE_REPOSITORY = BindingKey.create<
        UserRoleModelRepository<UserModel, RoleModel>
    >("authorization.repositories.user_role");
    export const GROUP_ROLE_REPOSITORY = BindingKey.create<
        GroupRoleModelRepository<GroupModel, RoleModel>
    >("authorization.repositories.group_role");
    export const PERMISSION_ROLE_REPOSITORY = BindingKey.create<
        PermissionRoleModelRepository<PermissionModel, RoleModel>
    >("authorization.repositories.permission_role");

    /**
     * Action Provider key: output
     *  1. AuthorizeFn
     *
     */
    export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
        "authorization.providers.authorize"
    );
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata,
    MethodDecorator
>("authorization.operationsMetadata");
