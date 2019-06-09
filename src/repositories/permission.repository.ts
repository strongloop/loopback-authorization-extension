import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

import { Permission } from "./../models";

export class PermissionRepository<
    PermissionModel extends Permission
> extends DefaultCrudRepository<
    PermissionModel,
    typeof Permission.prototype.id
> {
    constructor(
        ctor: typeof Entity & { prototype: PermissionModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
