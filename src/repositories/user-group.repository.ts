import { inject } from "@loopback/context";
import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { PrivateAuthorizationBindings, AuthorizationBindings } from "../keys";
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
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject(AuthorizationBindings.USER_REPOSITORY)
        userRepository: UserRepository<User, UserRelations>,
        @inject(AuthorizationBindings.GROUP_REPOSITORY)
        groupRepository: GroupRepository<Group, GroupRelations>
    ) {
        super(UserGroup, dataSource);

        this.user = this.createBelongsToAccessorFor(
            "user",
            async () => userRepository
        );
        this.group = this.createBelongsToAccessorFor(
            "group",
            async () => groupRepository
        );
    }
}
