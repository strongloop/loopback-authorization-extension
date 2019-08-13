import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { PermissionModel, PermissionModelRelations } from "../models";
import {} from "@loopback/core";

export class PermissionModelRepository extends DefaultCrudRepository<
    PermissionModel,
    typeof PermissionModel.prototype.id,
    PermissionModelRelations
> {
    constructor(dataSource: juggler.DataSource) {
        super(PermissionModel, dataSource);
    }
}
