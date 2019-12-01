import { Context } from "@loopback/context";
import { Class, SchemaMigrationOptions } from "@loopback/repository";
import { Ctor } from "loopback-history-extension";

import { createHash } from "crypto";

import {
    PrivateAuthorizationBindings,
    AuthorizationBindings,
    findAuthorization
} from "../keys";

import { PermissionsList } from "../types";
import {
    UserRepository,
    GroupRepository,
    RoleRepository,
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "../repositories";
import { User, Group, Role, Permission } from "../models";

export interface AuthorizationMixinConfigs {
    permissions?: Class<PermissionsList>;
    userModel?: Ctor<User>;
    groupModel?: Ctor<Group>;
    roleModel?: Ctor<Role>;
    permissionModel?: Ctor<Permission>;
}

export function AuthorizationMixin<T extends Class<any>>(
    baseClass: T,
    configs: AuthorizationMixinConfigs = {}
) {
    const bootModels = (ctx: Context, configs: AuthorizationMixinConfigs) => {
        ctx.bind(PrivateAuthorizationBindings.USER_MODEL).to(
            configs.userModel || User
        );
        ctx.bind(PrivateAuthorizationBindings.GROUP_MODEL).to(
            configs.groupModel || Group
        );
        ctx.bind(PrivateAuthorizationBindings.ROLE_MODEL).to(
            configs.roleModel || Role
        );
        ctx.bind(PrivateAuthorizationBindings.PERMISSION_MODEL).to(
            configs.permissionModel || Permission
        );
    };

    const bootDataSources = (ctx: Context) => {
        let dataSource = findAuthorization(ctx, "DataSource");

        if (dataSource) {
            ctx.bind(PrivateAuthorizationBindings.DATASOURCE).to(dataSource);
        } else {
            throw new Error("AuthorizationComponent: DataSource not found!");
        }
    };

    const bootRepositories = (ctx: Context) => {
        /**
         * Find, Bind User Repository
         */
        let userRepository = findAuthorization(ctx, "UserRepository");
        if (userRepository) {
            ctx.bind(AuthorizationBindings.USER_REPOSITORY).to(userRepository);
        } else {
            ctx.bind(AuthorizationBindings.USER_REPOSITORY).toClass(
                UserRepository
            );
        }

        /**
         * Find, Bind Group Repository
         */
        let groupRepository = findAuthorization(ctx, "GroupRepository");
        if (groupRepository) {
            ctx.bind(AuthorizationBindings.GROUP_REPOSITORY).to(
                groupRepository
            );
        } else {
            ctx.bind(AuthorizationBindings.GROUP_REPOSITORY).toClass(
                GroupRepository
            );
        }

        /**
         * Find, Bind Role Repository
         */
        let roleRepository = findAuthorization(ctx, "RoleRepository");
        if (roleRepository) {
            ctx.bind(AuthorizationBindings.ROLE_REPOSITORY).to(roleRepository);
        } else {
            ctx.bind(AuthorizationBindings.ROLE_REPOSITORY).toClass(
                RoleRepository
            );
        }

        /**
         * Find, Bind Permission Repository
         */
        let permissionRepository = findAuthorization(
            ctx,
            "PermissionRepository"
        );
        if (permissionRepository) {
            ctx.bind(AuthorizationBindings.PERMISSION_REPOSITORY).to(
                permissionRepository
            );
        } else {
            ctx.bind(AuthorizationBindings.PERMISSION_REPOSITORY).toClass(
                PermissionRepository
            );
        }

        /**
         * Bind Relation Repositories
         */
        ctx.bind(AuthorizationBindings.USER_GROUP_REPOSITORY).toClass(
            UserGroupRepository
        );
        ctx.bind(AuthorizationBindings.USER_ROLE_REPOSITORY).toClass(
            UserRoleRepository
        );
        ctx.bind(AuthorizationBindings.GROUP_ROLE_REPOSITORY).toClass(
            GroupRoleRepository
        );
        ctx.bind(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY).toClass(
            RolePermissionRepository
        );
    };

    return class extends baseClass {
        async boot() {
            await super.boot();

            bootModels(this as any, configs);
            bootDataSources(this as any);
            bootRepositories(this as any);
        }

        async migrateSchema(
            options: SchemaMigrationOptions = {}
        ): Promise<void> {
            await super.migrateSchema(options);

            if (configs.permissions) {
                // create default permissions
                const permissions = new configs.permissions();

                const permissionRepository = this.getSync(
                    AuthorizationBindings.PERMISSION_REPOSITORY
                );

                await permissionRepository.createAll(
                    Object.keys(permissions).map(
                        permissionKey =>
                            new Permission({
                                id: createHash("md5")
                                    .update(permissionKey)
                                    .digest("hex"),
                                key: permissionKey,
                                description: (permissions as any)[permissionKey]
                            })
                    )
                );
            }
        }
    };
}
