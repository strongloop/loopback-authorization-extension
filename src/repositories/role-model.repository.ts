import { Getter } from "@loopback/core";
import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import { RoleModel, RoleModelRelations } from "../models";

export class RoleModelRepository<
    Role extends RoleModel,
    RoleRelations extends RoleModelRelations
> extends DefaultCrudRepository<
    Role,
    typeof RoleModel.prototype.id,
    RoleRelations
> {
    public readonly parent: BelongsToAccessor<
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

        this.parent = this.createBelongsToAccessorFor(
            "parent",
            Getter.fromValue(this)
        );
    }
}
