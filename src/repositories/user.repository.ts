import { DefaultCrudRepository, juggler } from "@loopback/repository";

import { User, UserRelations } from "../models";

export class UserRepository<
    Model extends User,
    ModelRelations extends UserRelations
> extends DefaultCrudRepository<
    Model,
    typeof User.prototype.id,
    ModelRelations
> {
    constructor(
        entityClass: typeof User & {
            prototype: Model;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}
