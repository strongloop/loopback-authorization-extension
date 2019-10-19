import { juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { User, UserRelations } from "../models";

export class UserRepository<
    Model extends User,
    ModelRelations extends UserRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    constructor(
        entityClass: typeof User & {
            prototype: Model;
        },
        dataSource: juggler.DataSource
    ) {
        super(entityClass, dataSource);
    }
}
