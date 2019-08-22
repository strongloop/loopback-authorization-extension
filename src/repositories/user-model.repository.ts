import { DefaultCrudRepository, juggler } from "@loopback/repository";

import { UserModel, UserModelRelations } from "../models";

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
