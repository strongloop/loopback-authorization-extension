import { Getter, bind, inject } from "@loopback/core";
import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import { GroupModel, GroupModelRelations } from "../models";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "Group" });

    return binding;
})
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

export function injectGroupRepositoryGetter() {
    return inject.getter(binding => {
        return false;
    });
    // TODO
}
