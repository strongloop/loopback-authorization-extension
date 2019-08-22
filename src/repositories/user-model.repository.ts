import { bind, inject } from "@loopback/core";
import { DefaultCrudRepository, juggler } from "@loopback/repository";

import { UserModel, UserModelRelations } from "../models";

/**
 * Add binding tags to repository, for tracking
 */
@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ model: "User" });

    return binding;
})
export class UserModelRepository<
    User extends UserModel,
    UserRelations extends UserModelRelations
> extends DefaultCrudRepository<
    User,
    typeof UserModel.prototype.id,
    UserRelations
> {
    constructor(
        entityClass: typeof UserModel & {
            prototype: User;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}

export function injectUserRepositoryGetter() {
    return inject.getter(binding => {
        return binding.tagMap.authorization && binding.tagMap.model === "User";
    });
}
