import {
    BelongsToAccessor,
    DefaultCrudRepository,
    Getter,
    juggler
} from "@loopback/repository";

import { UserGroup, User, Group } from "./../models";

import { UserRepository, GroupRepository } from ".";

export class UserGroupRepository<
    UserModel extends User,
    GroupModel extends Group
> extends DefaultCrudRepository<UserGroup, typeof UserGroup.prototype.id> {
    public readonly user: BelongsToAccessor<
        UserModel,
        typeof UserGroup.prototype.id
    >;
    public readonly group: BelongsToAccessor<
        Group,
        typeof UserGroup.prototype.id
    >;

    constructor(
        userRepository: UserRepository<UserModel>,
        groupRepository: GroupRepository<GroupModel>,
        dataSource: juggler.DataSource
    ) {
        super(UserGroup, dataSource);

        let userRepositoryGetter: Getter<
            UserRepository<UserModel>
        > = async () => {
            return userRepository;
        };
        let groupRepositoryGetter: Getter<
            GroupRepository<GroupModel>
        > = async () => {
            return groupRepository;
        };

        this.user = this._createBelongsToAccessorFor(
            "user",
            userRepositoryGetter
        );
        this.group = this._createBelongsToAccessorFor(
            "group",
            groupRepositoryGetter
        );
    }
}
