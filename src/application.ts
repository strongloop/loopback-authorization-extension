import { BootMixin } from "@loopback/boot";
import { RepositoryMixin, SchemaMigrationOptions } from "@loopback/repository";
import { ServiceMixin } from "@loopback/service-proxy";
import { Application } from "@loopback/core";

import { createHash } from "crypto";

import {
    PrivateAuthorizationBindings,
    AuthorizationBindings,
    findAuthorization
} from "~/keys";
import { AuthorizationApplicationConfig, PermissionsList } from "~/types";

import { User, Group, Role, Permission } from "~/models";
import {
    AuthorizeActionProvider,
    GetUserPermissionsProvider
} from "~/providers";
import {
    UserRepository,
    GroupRepository,
    RoleRepository,
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "~/repositories";

export class AuthorizationApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(Application))
) {
    constructor(public options: AuthorizationApplicationConfig = {}) {
        super(options);
    }

    async boot() {
        await super.boot();

        this.bootAuthorizationModels();
        this.bootAuthorizationProviders();
        this.bootAuthorizationDataSources();
        this.bootAuthorizationRepositories();
    }

    async migrateSchema(options: SchemaMigrationOptions = {}): Promise<void> {
        await super.migrateSchema(options);

        /**
         * Create default permissions object
         */
        const AuthorizationPermissions =
            this.options.permissions || PermissionsList;
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

    private bootAuthorizationModels() {
        this.bind(PrivateAuthorizationBindings.USER_MODEL).to(
            this.options.userModel || User
        );
        this.bind(PrivateAuthorizationBindings.GROUP_MODEL).to(
            this.options.groupModel || Group
        );
        this.bind(PrivateAuthorizationBindings.ROLE_MODEL).to(
            this.options.roleModel || Role
        );
        this.bind(PrivateAuthorizationBindings.PERMISSION_MODEL).to(
            this.options.permissionModel || Permission
        );
    }

    private bootAuthorizationProviders() {
        this.bind(AuthorizationBindings.AUTHORIZE_ACTION).toProvider(
            AuthorizeActionProvider
        );
        this.bind(AuthorizationBindings.GET_USER_PERMISSIONS_ACTION).toProvider(
            GetUserPermissionsProvider
        );
    }

    private bootAuthorizationDataSources() {
        let dataSource = findAuthorization(this, "DataSource");
        if (dataSource) {
            this.bind(PrivateAuthorizationBindings.DATASOURCE).to(dataSource);
        } else {
            throw new Error("AuthorizationComponent: DataSource not found!");
        }
    }

    private bootAuthorizationRepositories() {
        /**
         * Find, Bind User Repository
         */
        let userRepository = findAuthorization(this, "UserRepository");
        if (userRepository) {
            this.bind(AuthorizationBindings.USER_REPOSITORY).to(userRepository);
        } else {
            this.bind(AuthorizationBindings.USER_REPOSITORY).toClass(
                UserRepository
            );
        }

        /**
         * Find, Bind Group Repository
         */
        let groupRepository = findAuthorization(this, "GroupRepository");
        if (groupRepository) {
            this.bind(AuthorizationBindings.GROUP_REPOSITORY).to(
                groupRepository
            );
        } else {
            this.bind(AuthorizationBindings.GROUP_REPOSITORY).toClass(
                GroupRepository
            );
        }

        /**
         * Find, Bind Role Repository
         */
        let roleRepository = findAuthorization(this, "RoleRepository");
        if (roleRepository) {
            this.bind(AuthorizationBindings.ROLE_REPOSITORY).to(roleRepository);
        } else {
            this.bind(AuthorizationBindings.ROLE_REPOSITORY).toClass(
                RoleRepository
            );
        }

        /**
         * Find, Bind Permission Repository
         */
        let permissionRepository = findAuthorization(
            this,
            "PermissionRepository"
        );
        if (permissionRepository) {
            this.bind(AuthorizationBindings.PERMISSION_REPOSITORY).to(
                permissionRepository
            );
        } else {
            this.bind(AuthorizationBindings.PERMISSION_REPOSITORY).toClass(
                PermissionRepository
            );
        }

        /**
         * Bind Relation Repositories
         */
        this.bind(AuthorizationBindings.USER_GROUP_REPOSITORY).toClass(
            UserGroupRepository
        );
        this.bind(AuthorizationBindings.USER_ROLE_REPOSITORY).toClass(
            UserRoleRepository
        );
        this.bind(AuthorizationBindings.GROUP_ROLE_REPOSITORY).toClass(
            GroupRoleRepository
        );
        this.bind(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY).toClass(
            RolePermissionRepository
        );
    }
}
