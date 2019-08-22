import { bind, inject } from "@loopback/core";
import { DefaultCrudRepository, juggler } from "@loopback/repository";

import { PermissionModel, PermissionModelRelations } from "../models";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "Permission" });

    return binding;
})
export class PermissionModelRepository<
    Permission extends PermissionModel,
    PermissionRelations extends PermissionModelRelations
> extends DefaultCrudRepository<
    Permission,
    typeof PermissionModel.prototype.id,
    PermissionRelations
> {
    constructor(
        entityClass: typeof PermissionModel & {
            prototype: Permission;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}

export function injectPermissionRepositoryGetter() {
    return inject.getter(binding => {
        return false;
    });
    // TODO
}
