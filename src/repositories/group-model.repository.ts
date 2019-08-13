import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";
import { GroupModel, GroupModelRelations } from "../models";
import { Getter } from "@loopback/core";

export class GroupModelRepository<
    Group extends GroupModel,
    GroupRelations extends GroupModelRelations
> extends DefaultCrudRepository<
    Group,
    typeof GroupModel.prototype.id,
    GroupRelations
> {
    public readonly groupModel: BelongsToAccessor<
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
        this.groupModel = this.createBelongsToAccessorFor(
            "parent",
            Getter.fromValue(this)
        );
    }
}
