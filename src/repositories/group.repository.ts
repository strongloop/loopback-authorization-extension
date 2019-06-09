import { Entity, DefaultCrudRepository } from "@loopback/repository";

import { Group } from "./../models";

export class GroupRepository<
    GroupModel extends Group
> extends DefaultCrudRepository<GroupModel, typeof Group.prototype.id> {
    constructor(
        ctor: typeof Entity & { prototype: GroupModel },
        dataSource: any
    ) {
        super(ctor, dataSource);
    }
}
