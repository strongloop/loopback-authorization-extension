import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

import { Role } from "./../models";

export class RoleRepository<
    RoleModel extends Role
> extends DefaultCrudRepository<RoleModel, typeof Role.prototype.id> {
    constructor(
        ctor: typeof Entity & { prototype: RoleModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
