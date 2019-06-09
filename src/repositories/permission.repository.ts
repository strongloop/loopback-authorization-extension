import { Entity, DefaultCrudRepository } from "@loopback/repository";

import { Permission } from "./../models";

export class PermissionRepository<
    PermissionModel extends Permission
> extends DefaultCrudRepository<
    PermissionModel,
    typeof Permission.prototype.id
> {
    constructor(
        ctor: typeof Entity & { prototype: PermissionModel },
        dataSource: any
    ) {
        super(ctor, dataSource);
    }
}
