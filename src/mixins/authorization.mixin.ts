import { Class, SchemaMigrationOptions } from "@loopback/repository";

import {
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "../repositories";

export function AuthorizationMixin<T extends Class<any>>(baseClass: T) {
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

            // create default permissions
        }
    };
}
