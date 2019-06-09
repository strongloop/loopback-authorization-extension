import {
    BelongsToAccessor,
    DefaultCrudRepository,
    Getter
} from "@loopback/repository";

import { GroupRole, Group, Role } from "./../models";

import { GroupRepository, RoleRepository } from ".";

export class GroupRoleRepository<
    GroupModel extends Group,
    RoleModel extends Role
> extends DefaultCrudRepository<GroupRole, typeof GroupRole.prototype.id> {
    public readonly group: BelongsToAccessor<
        GroupModel,
        typeof GroupRole.prototype.id
    >;
    public readonly role: BelongsToAccessor<
        Role,
        typeof GroupRole.prototype.id
    >;

    constructor(
        groupRepository: GroupRepository<GroupModel>,
        roleRepository: RoleRepository<RoleModel>,
        dataSource: any
    ) {
        super(GroupRole, dataSource);

        let groupRepositoryGetter: Getter<
            GroupRepository<GroupModel>
        > = async () => {
            return groupRepository;
        };
        let roleRepositoryGetter: Getter<
            RoleRepository<RoleModel>
        > = async () => {
            return roleRepository;
        };

        this.group = this._createBelongsToAccessorFor(
            "group",
            groupRepositoryGetter
        );
        this.role = this._createBelongsToAccessorFor(
            "role",
            roleRepositoryGetter
        );
    }
}
