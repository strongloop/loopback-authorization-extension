import {
    DefaultCrudRepository,
    repository,
    BelongsToAccessor
} from "@loopback/repository";
import {
    UserGroupModel,
    UserGroupModelRelations,
    UserModel,
    GroupModel
} from "../models";
import { MySqlDataSource } from "../datasources";
import { inject, Getter } from "@loopback/core";
import { UserModelRepository, GroupModelRepository } from "./";

export class UserGroupModelRepository extends DefaultCrudRepository<
    UserGroupModel,
    typeof UserGroupModel.prototype.id,
    UserGroupModelRelations
> {
    public readonly userModel: BelongsToAccessor<
        UserModel,
        typeof UserGroupModel.prototype.id
    >;

    public readonly groupModel: BelongsToAccessor<
        GroupModel,
        typeof UserGroupModel.prototype.id
    >;

    constructor(
        @inject("datasources.MySQL") dataSource: MySqlDataSource,
        @repository.getter("UserModelRepository")
        protected userModelRepositoryGetter: Getter<UserModelRepository>,
        @repository.getter("GroupModelRepository")
        protected groupModelRepositoryGetter: Getter<GroupModelRepository>
    ) {
        super(UserGroupModel, dataSource);
        this.groupModel = this.createBelongsToAccessorFor(
            "group",
            groupModelRepositoryGetter
        );
        this.userModel = this.createBelongsToAccessorFor(
            "user",
            userModelRepositoryGetter
        );
    }
}
