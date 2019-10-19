import { juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { Permission, PermissionRelations } from "../models";

export class PermissionRepository<
    Model extends Permission,
    ModelRelations extends PermissionRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    constructor(
        entityClass: typeof Permission & {
            prototype: Model;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}
