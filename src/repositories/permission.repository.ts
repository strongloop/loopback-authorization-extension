import { inject } from "@loopback/context";
import { juggler, DefaultCrudRepository } from "@loopback/repository";
import { Ctor } from "loopback-history-extension";

import { PrivateAuthorizationBindings } from "../keys";
import { Permission, PermissionRelations } from "../models";

export class PermissionRepository<
    Model extends Permission,
    ModelRelations extends PermissionRelations
> extends DefaultCrudRepository<Model, string, ModelRelations> {
    constructor(
        @inject(PrivateAuthorizationBindings.PERMISSION_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
