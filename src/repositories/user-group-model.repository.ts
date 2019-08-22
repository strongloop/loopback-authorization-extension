import { Getter, bind, inject } from "@loopback/core";
import { DefaultCrudRepository, BelongsToAccessor } from "@loopback/repository";

import { AuthorizationDataSource, injectDataSource } from "../datasources";
import {
    UserGroupModel,
    UserGroupModelRelations,
    UserModel,
    UserModelRelations,
    GroupModel,
    GroupModelRelations
} from "../models";
import {
    UserModelRepository,
    injectUserRepositoryGetter,
    GroupModelRepository,
    injectGroupRepositoryGetter
} from "./";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "UserGroup" });

    return binding;
})
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
        @injectDataSource()
        dataSource: AuthorizationDataSource[],
        @injectUserRepositoryGetter()
        userModelRepositoryGetter: Getter<
            UserModelRepository<UserModel, UserModelRelations>
        >[],
        @injectGroupRepositoryGetter()
        groupModelRepositoryGetter: Getter<
            GroupModelRepository<GroupModel, GroupModelRelations>
        >[]
    ) {
        super(UserGroupModel, dataSource[0]);

        this.userModel = this.createBelongsToAccessorFor(
            "user",
            userModelRepositoryGetter[0]
        );
        this.groupModel = this.createBelongsToAccessorFor(
            "group",
            groupModelRepositoryGetter[0]
        );
    }
}

export function injectUserGroupRepositoryGetter() {
    return inject.getter(binding => {
        return (
            binding.tagMap.authorization && binding.tagMap.model === "UserGroup"
        );
    });
}
