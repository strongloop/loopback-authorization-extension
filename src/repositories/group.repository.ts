import { Entity, DefaultCrudRepository, juggler } from "@loopback/repository";

import { Group } from "./../models";

export class GroupRepository<
    GroupModel extends Group
> extends DefaultCrudRepository<GroupModel, typeof Group.prototype.id> {
    constructor(
        ctor: typeof Entity & { prototype: GroupModel },
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
