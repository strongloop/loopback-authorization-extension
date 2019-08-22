import { Class, SchemaMigrationOptions } from "@loopback/repository";

import { StringKey } from "../types";
import {
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "../repositories";
import { Permission, PermissionRelations } from "../models";

export interface AuthorizationMixinConfigs {
    defaultPermissions?: StringKey[];
}

export function AuthorizationMixin<T extends Class<any>>(
    baseClass: T,
    configs: AuthorizationMixinConfigs = {}
) {
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

            if (configs.defaultPermissions) {
                // create default permissions
                // TODO
                throw new Error(
                    "Default permissions migration not implemented yet!"
                );
                // const permissionRepository: PermissionRepository<
                //     Permission,
                //     PermissionRelations
                // > = this.getRepository(PermissionRepository);

                // await permissionRepository.createAll(
                //     configs.defaultPermissions.map(
                //         permission =>
                //             new Permission({
                //                 key: permission
                //             })
                //     )
                // );
            }
        }
    };
}
