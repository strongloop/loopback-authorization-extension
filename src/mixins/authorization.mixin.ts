import { Context } from "@loopback/context";
import { Class, SchemaMigrationOptions } from "@loopback/repository";

import { createHash } from "crypto";

import {
    PrivateAuthorizationBindings,
    AuthorizationBindings,
    findAuthorization
} from "../keys";
import { AuthorizationMixinConfig, PermissionsList } from "../types";

import { User, Role, Permission } from "../models";
import {
    AuthorizeActionProvider,
    GetUserPermissionsProvider
} from "../providers";
import {
    UserRepository,
    RoleRepository,
    PermissionRepository,
    UserRoleRepository,
    RolePermissionRepository
} from "../repositories";

export function AuthorizationMixin<T extends Class<any>>(superClass: T) {
    const bootModels = (ctx: Context, configs: AuthorizationMixinConfig) => {
        ctx.bind(PrivateAuthorizationBindings.USER_MODEL).to(
            configs.userModel || User
        );
        ctx.bind(PrivateAuthorizationBindings.ROLE_MODEL).to(
            configs.roleModel || Role
        );
        ctx.bind(PrivateAuthorizationBindings.PERMISSION_MODEL).to(
            configs.permissionModel || Permission
        );
    };

    const bootProviders = (ctx: Context) => {
        ctx.bind(AuthorizationBindings.AUTHORIZE_ACTION).toProvider(
            AuthorizeActionProvider
        );
        ctx.bind(AuthorizationBindings.GET_USER_PERMISSIONS_ACTION).toProvider(
            GetUserPermissionsProvider
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
            ctx.bind(AuthorizationBindings.USER_REPOSITORY)
                .toClass(UserRepository)
                .tag("repository");
        }

        /**
         * Find, Bind Role Repository
         */
        let roleRepository = findAuthorization(ctx, "RoleRepository");
        if (roleRepository) {
            ctx.bind(AuthorizationBindings.ROLE_REPOSITORY).to(roleRepository);
        } else {
            ctx.bind(AuthorizationBindings.ROLE_REPOSITORY)
                .toClass(RoleRepository)
                .tag("repository");
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
            ctx.bind(AuthorizationBindings.PERMISSION_REPOSITORY)
                .toClass(PermissionRepository)
                .tag("repository");
        }

        /**
         * Bind Relation Repositories
         */
        ctx.bind(AuthorizationBindings.USER_ROLE_REPOSITORY)
            .toClass(UserRoleRepository)
            .tag("repository");
        ctx.bind(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
            .toClass(RolePermissionRepository)
            .tag("repository");
    };

    return class extends superClass {
        public authorizationConfigs: AuthorizationMixinConfig = {};

        async boot() {
            await super.boot();

            bootModels(this as any, this.authorizationConfigs);
            bootProviders(this as any);
            bootDataSources(this as any);
            bootRepositories(this as any);
        }

        async migrateSchema(
            options: SchemaMigrationOptions = {}
        ): Promise<void> {
            await super.migrateSchema(options);

            /**
             * Create default permissions object
             */
            const AuthorizationPermissions =
                this.authorizationConfigs.permissions || PermissionsList;
            const permissions = new AuthorizationPermissions();

            /**
             * Get permissions repository
             */
            const permissionRepository = this.getSync(
                AuthorizationBindings.PERMISSION_REPOSITORY
            );

            /**
             * Migrate permissions
             *
             * 1. id: hash(key)
             * 2. key: key
             * 3. description: description
             */
            await permissionRepository.deleteAll({
                id: {
                    inq: Object.keys(permissions).map(permissionKey =>
                        createHash("md5")
                            .update(permissionKey)
                            .digest("hex")
                    )
                }
            });
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
    };
}
