import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

export class GroupRepository<
    GroupModel extends Entity
> extends DefaultCrudRepository<GroupModel, "string"> {
    constructor(
        ctor: typeof Entity & { prototype: GroupModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
