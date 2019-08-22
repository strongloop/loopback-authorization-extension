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
    GroupRoleModel,
    GroupRoleModelRelations,
    GroupModel,
    GroupModelRelations,
    RoleModel,
    RoleModelRelations
} from "../models";
import { GroupModelRepository, RoleModelRepository } from "./";

export class GroupRoleModelRepository extends DefaultCrudRepository<
    GroupRoleModel,
    typeof GroupRoleModel.prototype.id,
    GroupRoleModelRelations
> {
    public readonly group: BelongsToAccessor<
        GroupModel,
        typeof GroupRoleModel.prototype.id
    >;

    public readonly role: BelongsToAccessor<
        RoleModel,
        typeof GroupRoleModel.prototype.id
    >;

    constructor(
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectGroupRepository()
        groupModelRepository: GroupModelRepository<
            GroupModel,
            GroupModelRelations
        >[],
        @injectRoleRepository()
        roleModelRepository: RoleModelRepository<
            RoleModel,
            RoleModelRelations
        >[]
    ) {
        super(GroupRoleModel, dataSource[0]);

        this.group = this.createBelongsToAccessorFor(
            "group",
            async () => groupModelRepository[0]
        );
        this.role = this.createBelongsToAccessorFor(
            "role",
            async () => roleModelRepository[0]
        );
    }
}
