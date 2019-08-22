import { Getter, bind, inject } from "@loopback/core";
import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import { RoleModel, RoleModelRelations } from "../models";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "Role" });

    return binding;
})
export class RoleModelRepository<
    Role extends RoleModel,
    RoleRelations extends RoleModelRelations
> extends DefaultCrudRepository<
    Role,
    typeof RoleModel.prototype.id,
    RoleRelations
> {
    public readonly roleModel: BelongsToAccessor<
        Role,
        typeof RoleModel.prototype.id
    >;

    constructor(
        entityClass: typeof RoleModel & {
            prototype: Role;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "parent",
            Getter.fromValue(this)
        );
    }
}

export function injectRoleRepositoryGetter() {
    return inject.getter(binding => {
        return binding.tagMap.authorization && binding.tagMap.model === "Role";
    });
}
