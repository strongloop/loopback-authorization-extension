import { inject } from "@loopback/context";
import { juggler } from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import { PrivateAuthorizationBindings } from "@authorization/keys";

import { User, UserRelations } from "@authorization/models";

export class UserRepository<
    Model extends User,
    ModelRelations extends UserRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    constructor(
        @inject(PrivateAuthorizationBindings.USER_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);
    }
}
