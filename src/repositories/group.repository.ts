import { Getter } from "@loopback/core";
import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { Group, GroupRelations } from "../models";

export class GroupRepository<
    Model extends Group,
    ModelRelations extends GroupRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly parent: BelongsToAccessor<Group, typeof Group.prototype.id>;

    constructor(
        entityClass: typeof Group & {
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
