import { inject } from "@loopback/context";
import { juggler } from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import { AuthorizationBindings } from "../keys";
import { User, UserRelations } from "../models";

export class UserRepository<
    Model extends User,
    ModelRelations extends UserRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    constructor(
        @inject(AuthorizationBindings.USER_MODEL)
        ctor: Ctor<Model>,
        @inject(AuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
