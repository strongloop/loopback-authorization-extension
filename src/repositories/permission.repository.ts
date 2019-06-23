import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

export class PermissionRepository<
    PermissionModel extends Entity
> extends DefaultCrudRepository<PermissionModel, "string"> {
    constructor(
        ctor: typeof Entity & { prototype: PermissionModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
