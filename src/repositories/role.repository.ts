import { Getter } from "@loopback/core";
import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import { Role, RoleRelations } from "../models";

export class RoleRepository<
    Model extends Role,
    ModelRelations extends RoleRelations
> extends DefaultCrudRepository<
    Model,
    typeof Role.prototype.id,
    ModelRelations
> {
    public readonly parent: BelongsToAccessor<Role, typeof Role.prototype.id>;

    constructor(
        entityClass: typeof Role & {
            prototype: Model;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);

        this.parent = this.createBelongsToAccessorFor(
            "parentId",
            Getter.fromValue(this)
        );
    }
}
