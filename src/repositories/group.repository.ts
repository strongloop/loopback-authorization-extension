import { Getter } from "@loopback/core";
import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import { Group, GroupRelations } from "../models";

export class GroupRepository<
    Model extends Group,
    ModelRelations extends GroupRelations
> extends DefaultCrudRepository<
    Model,
    typeof Group.prototype.id,
    ModelRelations
> {
    public readonly parent: BelongsToAccessor<Group, typeof Group.prototype.id>;

    constructor(
        entityClass: typeof Group & {
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
