import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";

import {
    injectDataSource,
    injectGroupRepository,
    injectRoleRepository
} from "../keys";
import {
    GroupRole,
    GroupRoleRelations,
    Group,
    GroupRelations,
    Role,
    RoleRelations
} from "../models";
import { GroupRepository, RoleRepository } from ".";

export class GroupRoleRepository extends DefaultCrudRepository<
    GroupRole,
    typeof GroupRole.prototype.id,
    GroupRoleRelations
> {
    public readonly group: BelongsToAccessor<
        Group,
        typeof GroupRole.prototype.id
    >;

    public readonly role: BelongsToAccessor<
        Role,
        typeof GroupRole.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectGroupRepository()
        groupRepository: GroupRepository<Group, GroupRelations>[],
        @injectRoleRepository()
        roleRepository: RoleRepository<Role, RoleRelations>[]
    ) {
        super(GroupRole, dataSource[0]);

        this.group = this.createBelongsToAccessorFor(
            "groupId",
            async () => groupRepository[0]
        );
        this.role = this.createBelongsToAccessorFor(
            "roleId",
            async () => roleRepository[0]
        );
    }
}
