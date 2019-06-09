import { BindingKey, MetadataAccessor } from "@loopback/context";

import { Entity, juggler } from "@loopback/repository";
import { User, Group, Permission, Role } from "./models";

import {
    UserRepository,
    GroupRepository,
    PermissionRepository,
    RoleRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    PermissionRoleRepository
} from "./repositories";

import { AuthorizeFn } from "./types";
import { AuthorizationMetadata } from "./decorators";

export namespace AuthorizationBindings {
    export const USER_MODEL = BindingKey.create<
        typeof Entity & { prototype: User }
    >("authorization.actions.user");
    export const GROUP_MODEL = BindingKey.create<
        typeof Entity & { prototype: Group }
    >("authorization.models.group");
    export const PERMISSION_MODEL = BindingKey.create<
        typeof Entity & { prototype: Permission }
    >("authorization.models.permission");
    export const ROLE_MODEL = BindingKey.create<
        typeof Entity & { prototype: Role }
    >("authorization.models.role");
    export const DATASOURCE = BindingKey.create<juggler.DataSource>(
        "authorization.datasources.datasource"
    );

    export const USER_REPOSITORY = BindingKey.create<UserRepository<User>>(
        "authorization.repositories.user"
    );
    export const GROUP_REPOSITORY = BindingKey.create<GroupRepository<Group>>(
        "authorization.repositories.group"
    );
    export const PERMISSION_REPOSITORY = BindingKey.create<
        PermissionRepository<Permission>
    >("authorization.repositories.permission");
    export const ROLE_REPOSITORY = BindingKey.create<RoleRepository<Role>>(
        "authorization.repositories.role"
    );
    export const USER_GROUP_REPOSITORY = BindingKey.create<
        UserGroupRepository<User, Group>
    >("authorization.repositories.user_group");
    export const USER_ROLE_REPOSITORY = BindingKey.create<
        UserRoleRepository<User, Role>
    >("authorization.repositories.user_role");
    export const GROUP_ROLE_REPOSITORY = BindingKey.create<
        GroupRoleRepository<Group, Role>
    >("authorization.repositories.group_role");
    export const PERMISSION_ROLE_REPOSITORY = BindingKey.create<
        PermissionRoleRepository<Permission, Role>
    >("authorization.repositories.permission_role");

    export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
        "authorization.actions.authorize"
    );
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata,
    MethodDecorator
>("authorization.operationsMetadata");
