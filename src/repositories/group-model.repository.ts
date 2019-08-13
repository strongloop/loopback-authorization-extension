import {
    DefaultCrudRepository,
    repository,
    BelongsToAccessor
} from "@loopback/repository";
import { GroupModel, GroupModelRelations } from "../models";
import { MySqlDataSource } from "../datasources";
import { inject, Getter } from "@loopback/core";

export class GroupModelRepository extends DefaultCrudRepository<
    GroupModel,
    typeof GroupModel.prototype.id,
    GroupModelRelations
> {
    public readonly groupModel: BelongsToAccessor<
        GroupModel,
        typeof GroupModel.prototype.id
    >;

    constructor(
        @inject("datasources.MySQL") dataSource: MySqlDataSource,
        @repository.getter("GroupModelRepository")
        protected groupModelRepositoryGetter: Getter<GroupModelRepository>
    ) {
        super(GroupModel, dataSource);
        this.groupModel = this.createBelongsToAccessorFor(
            "parent",
            groupModelRepositoryGetter
        );
    }
}
