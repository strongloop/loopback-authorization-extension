import { juggler, DefaultCrudRepository } from "@loopback/repository";

import { Permission, PermissionRelations } from "../models";

export class PermissionRepository<
    Model extends Permission,
    ModelRelations extends PermissionRelations
> extends DefaultCrudRepository<Model, string, ModelRelations> {
    constructor(
        entityClass: typeof Permission & {
            prototype: Model;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}
