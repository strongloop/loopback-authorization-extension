import { Getter } from "@loopback/core";
import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import { GroupModel, GroupModelRelations } from "../models";

export class GroupModelRepository<
    Group extends GroupModel,
    GroupRelations extends GroupModelRelations
> extends DefaultCrudRepository<
    Group,
    typeof GroupModel.prototype.id,
    GroupRelations
> {
    public readonly parent: BelongsToAccessor<
        Group,
        typeof GroupModel.prototype.id
    >;

    constructor(
        entityClass: typeof GroupModel & {
            prototype: Group;
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
