import { Component, inject, CoreBindings, Application } from "@loopback/core";
import { Entity, juggler } from "@loopback/repository";

import { AuthorizationBindings } from "./keys";

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

export class AuthorizationComponent implements Component {
    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE)
        app: Application,
        @inject(AuthorizationBindings.USER_MODEL)
        userCtor: typeof Entity & { prototype: User },
        @inject(AuthorizationBindings.GROUP_MODEL)
        groupCtor: typeof Entity & { prototype: Group },
        @inject(AuthorizationBindings.PERMISSION_MODEL)
        permissionCtor: typeof Entity & { prototype: Permission },
        @inject(AuthorizationBindings.ROLE_MODEL)
        roleCtor: typeof Entity & { prototype: Role },
        @inject(AuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource
    ) {
        let userRepository = new UserRepository<User>(userCtor, dataSource);
        let groupRepository = new GroupRepository<Group>(groupCtor, dataSource);
        let permissionRepository = new PermissionRepository<Permission>(
            permissionCtor,
            dataSource
        );
        let roleRepository = new RoleRepository<Role>(roleCtor, dataSource);

        let userGroupRepository = new UserGroupRepository<User, Group>(
            userRepository,
            groupRepository,
            dataSource
        );
        let userRoleRepository = new UserRoleRepository<User, Role>(
            userRepository,
            roleRepository,
            dataSource
        );
        let groupRoleRepository = new GroupRoleRepository<Group, Role>(
            groupRepository,
            roleRepository,
            dataSource
        );
        let permissionRoleRepository = new PermissionRoleRepository<
            Permission,
            Role
        >(permissionRepository, roleRepository, dataSource);

        app.bind(AuthorizationBindings.USER_REPOSITORY).to(userRepository);
        app.bind(AuthorizationBindings.GROUP_REPOSITORY).to(groupRepository);
        app.bind(AuthorizationBindings.PERMISSION_REPOSITORY).to(
            permissionRepository
        );
        app.bind(AuthorizationBindings.ROLE_REPOSITORY).to(roleRepository);
        app.bind(AuthorizationBindings.USER_GROUP_REPOSITORY).to(
            userGroupRepository
        );
        app.bind(AuthorizationBindings.USER_ROLE_REPOSITORY).to(
            userRoleRepository
        );
        app.bind(AuthorizationBindings.GROUP_ROLE_REPOSITORY).to(
            groupRoleRepository
        );
        app.bind(AuthorizationBindings.PERMISSION_ROLE_REPOSITORY).to(
            permissionRoleRepository
        );
    }
}
