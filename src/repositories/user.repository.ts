import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

import { User } from "./../models";

export class UserRepository<
    UserModel extends User
> extends DefaultCrudRepository<UserModel, typeof User.prototype.id> {
    constructor(
        ctor: typeof Entity & { prototype: UserModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
