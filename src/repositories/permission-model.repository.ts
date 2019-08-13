import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { PermissionModel, PermissionModelRelations } from "../models";
import {} from "@loopback/core";

export class PermissionModelRepository<
    Permission extends PermissionModel,
    PermissionRelations extends PermissionModelRelations
> extends DefaultCrudRepository<
    Permission,
    typeof PermissionModel.prototype.id,
    PermissionRelations
> {
    constructor(
        entityClass: typeof PermissionModel & {
            prototype: Permission;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}
