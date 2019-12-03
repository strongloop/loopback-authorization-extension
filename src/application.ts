import { BootMixin } from "@loopback/boot";
import { RepositoryMixin, SchemaMigrationOptions } from "@loopback/repository";
import { Application } from "@loopback/core";

import { createHash } from "crypto";

import {
    PrivateAuthorizationBindings,
    AuthorizationBindings,
    findAuthorization
} from "@authorization/keys";
import { AuthorizationApplicationConfig } from "@authorization/types";

import { User, Group, Role, Permission } from "@authorization/models";
import {
    UserRepository,
    GroupRepository,
    RoleRepository,
    PermissionRepository
} from "@authorization/repositories";

export class AuthorizationApplication extends BootMixin(
    RepositoryMixin(Application)
) {
    constructor(public options: AuthorizationApplicationConfig = {}) {
        super(options);
    }

    async boot() {
        await super.boot();

        this.bootModels();
        this.bootDataSources();
        this.bootRepositories();
    }

    async migrateSchema(options: SchemaMigrationOptions = {}): Promise<void> {
        await super.migrateSchema(options);

        if (this.options.permissions) {
            // create default permissions
            const permissions = new this.options.permissions();

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

    private bootModels() {
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

    private bootDataSources() {
        let dataSource = findAuthorization(this, "DataSource");
        if (dataSource) {
            this.bind(PrivateAuthorizationBindings.DATASOURCE).to(dataSource);
        } else {
            throw new Error("AuthorizationComponent: DataSource not found!");
        }
    }

    private bootRepositories() {
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
