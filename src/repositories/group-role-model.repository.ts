import {
    DefaultCrudRepository,
    repository,
    BelongsToAccessor
} from "@loopback/repository";
import {
    GroupRoleModel,
    GroupRoleModelRelations,
    GroupModel,
    RoleModel
} from "../models";
import { MySqlDataSource } from "../datasources";
import { inject, Getter } from "@loopback/core";
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
        @inject("datasources.MySQL") dataSource: MySqlDataSource,
        @repository.getter("GroupModelRepository")
        protected groupModelRepositoryGetter: Getter<GroupModelRepository>,
        @repository.getter("RoleModelRepository")
        protected roleModelRepositoryGetter: Getter<RoleModelRepository>
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
