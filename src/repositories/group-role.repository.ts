import {
    Entity,
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler
} from "@loopback/repository";

import { GroupRole } from "./../models";

import { GroupRepository, RoleRepository } from ".";

export class GroupRoleRepository<
    GroupModel extends Entity,
    RoleModel extends Entity
> extends DefaultCrudRepository<
    GroupRole<GroupModel, RoleModel>,
    typeof GroupRole.prototype.id
> {
    public readonly group: BelongsToAccessor<
        GroupModel,
        typeof GroupRole.prototype.id
    >;
    public readonly role: BelongsToAccessor<
        RoleModel,
        typeof GroupRole.prototype.id
    >;

    constructor(
        groupRepository: GroupRepository<GroupModel>,
        roleRepository: RoleRepository<RoleModel>,
        dataSource: juggler.DataSource
    ) {
        super(GroupRole, dataSource);

        this.group = this._createBelongsToAccessorFor("group", async () => {
            return groupRepository;
        });
        this.role = this._createBelongsToAccessorFor("role", async () => {
            return roleRepository;
        });
    }
}
