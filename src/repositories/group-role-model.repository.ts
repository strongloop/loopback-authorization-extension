import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";
import {
    GroupRoleModel,
    GroupRoleModelRelations,
    GroupModel,
    RoleModel
} from "../models";
import { Getter } from "@loopback/core";
import { GroupModelRepository, RoleModelRepository } from "./";

export class GroupRoleModelRepository extends DefaultCrudRepository<
    GroupRoleModel,
    typeof GroupRoleModel.prototype.id,
    GroupRoleModelRelations
> {
    public readonly groupModel: BelongsToAccessor<
        GroupModel,
        typeof GroupRoleModel.prototype.id
    >;

    public readonly roleModel: BelongsToAccessor<
        RoleModel,
        typeof GroupRoleModel.prototype.id
    >;

    constructor(
        dataSource: juggler.DataSource,
        groupModelRepositoryGetter: Getter<GroupModelRepository>,
        roleModelRepositoryGetter: Getter<RoleModelRepository>
    ) {
        super(GroupRoleModel, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "role",
            roleModelRepositoryGetter
        );
        this.groupModel = this.createBelongsToAccessorFor(
            "group",
            groupModelRepositoryGetter
        );
    }
}
