import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import {
    injectDataSource,
    injectUserRepository,
    injectGroupRepository
} from "../keys";
import {
    UserGroup,
    UserGroupRelations,
    User,
    UserRelations,
    Group,
    GroupRelations
} from "../models";
import { UserRepository, GroupRepository } from ".";

export class UserGroupRepository extends HistoryCrudRepository<
    UserGroup,
    UserGroupRelations
> {
    public readonly user: BelongsToAccessor<
        User,
        typeof UserGroup.prototype.id
    >;

    public readonly group: BelongsToAccessor<
        Group,
        typeof UserGroup.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectUserRepository()
        userRepository: UserRepository<User, UserRelations>[],
        @injectGroupRepository()
        groupRepository: GroupRepository<Group, GroupRelations>[]
    ) {
        super(UserGroup, dataSource[0]);

        this.user = this.createBelongsToAccessorFor(
            "user",
            async () => userRepository[0]
        );
        this.group = this.createBelongsToAccessorFor(
            "group",
            async () => groupRepository[0]
        );
    }
}
