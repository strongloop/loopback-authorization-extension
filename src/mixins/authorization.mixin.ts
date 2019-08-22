import { Class, SchemaMigrationOptions } from "@loopback/repository";

import {
    UserGroupModelRepository,
    UserRoleModelRepository,
    GroupRoleModelRepository,
    RolePermissionModelRepository
} from "../repositories";

export function AuthorizationMixin<T extends Class<any>>(baseClass: T) {
    return class extends baseClass {
        async boot() {
            await super.boot();

            // bind component level repositories
            this.repository(UserGroupModelRepository);
            this.repository(UserRoleModelRepository);
            this.repository(GroupRoleModelRepository);
            this.repository(RolePermissionModelRepository);
        }

        async migrateSchema(
            options: SchemaMigrationOptions = {}
        ): Promise<void> {
            await super.migrateSchema(options);

            // create default permissions
        }
    };
}
