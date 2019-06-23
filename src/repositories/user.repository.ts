import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

export class UserRepository<
    UserModel extends Entity
> extends DefaultCrudRepository<UserModel, "string"> {
    constructor(
        ctor: typeof Entity & { prototype: UserModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
