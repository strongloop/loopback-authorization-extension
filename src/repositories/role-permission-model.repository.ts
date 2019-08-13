import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";
import {
    RolePermissionModel,
    RolePermissionModelRelations,
    RoleModel,
    PermissionModel
} from "../models";
import { Getter } from "@loopback/core";
import { RoleModelRepository, PermissionModelRepository } from "./";

export class RolePermissionModelRepository extends DefaultCrudRepository<
    RolePermissionModel,
    typeof RolePermissionModel.prototype.id,
    RolePermissionModelRelations
> {
    public readonly roleModel: BelongsToAccessor<
        RoleModel,
        typeof RolePermissionModel.prototype.id
    >;

    public readonly permissionModel: BelongsToAccessor<
        PermissionModel,
        typeof RolePermissionModel.prototype.id
    >;

    constructor(
        dataSource: juggler.DataSource,
        roleModelRepositoryGetter: Getter<RoleModelRepository>,
        permissionModelRepositoryGetter: Getter<PermissionModelRepository>
    ) {
        super(RolePermissionModel, dataSource);
        this.permissionModel = this.createBelongsToAccessorFor(
            "permission",
            permissionModelRepositoryGetter
        );
        this.roleModel = this.createBelongsToAccessorFor(
            "role",
            roleModelRepositoryGetter
        );
    }
}
