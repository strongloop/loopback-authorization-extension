import { Getter } from "@loopback/core";
import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { Role, RoleRelations } from "../models";

export class RoleRepository<
    Model extends Role,
    ModelRelations extends RoleRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly parent: BelongsToAccessor<Role, typeof Role.prototype.id>;

    constructor(
        entityClass: typeof Role & {
            prototype: Model;
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
