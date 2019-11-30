import { Class, SchemaMigrationOptions } from "@loopback/repository";

import { createHash } from "crypto";

import { PermissionsList } from "../types";
import {
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "../repositories";
import { Permission, PermissionRelations } from "../models";

export interface AuthorizationMixinConfigs<
    Permissions extends PermissionsList
> {
    permissions?: Class<Permissions>;
}

export function AuthorizationMixin<
    T extends Class<any>,
    Permissions extends PermissionsList
>(baseClass: T, configs: AuthorizationMixinConfigs<Permissions> = {}) {
    return class extends baseClass {
        async boot() {
            await super.boot();

            // bind component level repositories
            this.repository(UserGroupRepository);
            this.repository(UserRoleRepository);
            this.repository(GroupRoleRepository);
            this.repository(RolePermissionRepository);
        }

        async migrateSchema(
            options: SchemaMigrationOptions = {}
        ): Promise<void> {
            await super.migrateSchema(options);

            if (configs.permissions) {
                // create default permissions
                const permissions = new configs.permissions();

                const permissionRepository: PermissionRepository<
                    Permission,
                    PermissionRelations
                > = this.getRepository(PermissionRepository);

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
