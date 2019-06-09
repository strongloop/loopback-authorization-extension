import { Entity, DefaultCrudRepository } from "@loopback/repository";

import { Role } from "./../models";

export class RoleRepository<
    RoleModel extends Role
> extends DefaultCrudRepository<RoleModel, typeof Role.prototype.id> {
    constructor(
        ctor: typeof Entity & { prototype: RoleModel },
        dataSource: any
    ) {
        super(ctor, dataSource);
    }
}
