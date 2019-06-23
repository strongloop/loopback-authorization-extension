import {
    Entity,
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler
} from "@loopback/repository";

import { UserGroup } from "./../models";

import { UserRepository, GroupRepository } from ".";

export class UserGroupRepository<
    UserModel extends Entity,
    GroupModel extends Entity
> extends DefaultCrudRepository<
    UserGroup<UserModel, GroupModel>,
    typeof UserGroup.prototype.id
> {
    public readonly user: BelongsToAccessor<
        UserModel,
        typeof UserGroup.prototype.id
    >;
    public readonly group: BelongsToAccessor<
        GroupModel,
        typeof UserGroup.prototype.id
    >;

    constructor(
        userRepository: UserRepository<UserModel>,
        groupRepository: GroupRepository<GroupModel>,
        dataSource: juggler.DataSource
    ) {
        super(UserGroup, dataSource);

        this.user = this._createBelongsToAccessorFor("user", async () => {
            return userRepository;
        });
        this.group = this._createBelongsToAccessorFor("group", async () => {
            return groupRepository;
        });
    }
}
