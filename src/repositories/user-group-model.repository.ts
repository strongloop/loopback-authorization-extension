import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import {
    injectDataSource,
    injectUserRepository,
    injectGroupRepository
} from "../keys";
import {
    UserGroupModel,
    UserGroupModelRelations,
    UserModel,
    UserModelRelations,
    GroupModel,
    GroupModelRelations
} from "../models";
import { UserModelRepository, GroupModelRepository } from "./";

export class UserGroupModelRepository extends DefaultCrudRepository<
    UserGroupModel,
    typeof UserGroupModel.prototype.id,
    UserGroupModelRelations
> {
    public readonly user: BelongsToAccessor<
        UserModel,
        typeof UserGroupModel.prototype.id
    >;

    public readonly group: BelongsToAccessor<
        GroupModel,
        typeof UserGroupModel.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectUserRepository()
        userModelRepository: UserModelRepository<
            UserModel,
            UserModelRelations
        >[],
        @injectGroupRepository()
        groupModelRepository: GroupModelRepository<
            GroupModel,
            GroupModelRelations
        >[]
    ) {
        super(UserGroupModel, dataSource[0]);

        this.user = this.createBelongsToAccessorFor(
            "user",
            async () => userModelRepository[0]
        );
        this.group = this.createBelongsToAccessorFor(
            "group",
            async () => groupModelRepository[0]
        );
    }
}
