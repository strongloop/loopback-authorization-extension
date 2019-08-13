import { DefaultCrudRepository } from "@loopback/repository";
import { PermissionModel, PermissionModelRelations } from "../models";
import { MySqlDataSource } from "../datasources";
import { inject } from "@loopback/core";

export class PermissionModelRepository extends DefaultCrudRepository<
    PermissionModel,
    typeof PermissionModel.prototype.id,
    PermissionModelRelations
> {
    constructor(@inject("datasources.MySQL") dataSource: MySqlDataSource) {
        super(PermissionModel, dataSource);
    }
}
