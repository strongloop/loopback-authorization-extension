import { inject } from "@loopback/context";
import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import {
    PrivateAuthorizationBindings,
    AuthorizationBindings
} from "@authorization/keys";

import {
    GroupRole,
    GroupRoleRelations,
    Group,
    GroupRelations,
    Role,
    RoleRelations
} from "@authorization/models";
import { GroupRepository, RoleRepository } from "@authorization/repositories";

export class GroupRoleRepository extends HistoryCrudRepository<
    GroupRole,
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
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject(AuthorizationBindings.GROUP_REPOSITORY)
        groupRepository: GroupRepository<Group, GroupRelations>,
        @inject(AuthorizationBindings.ROLE_REPOSITORY)
        roleRepository: RoleRepository<Role, RoleRelations>
    ) {
        super(GroupRole, dataSource);

        this.group = this.createBelongsToAccessorFor(
            "group",
            async () => groupRepository
        );
        this.role = this.createBelongsToAccessorFor(
            "role",
            async () => roleRepository
        );
    }
}
