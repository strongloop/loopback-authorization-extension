import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

export class RoleRepository<
    RoleModel extends Entity
> extends DefaultCrudRepository<RoleModel, "string"> {
    constructor(
        ctor: typeof Entity & { prototype: RoleModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
