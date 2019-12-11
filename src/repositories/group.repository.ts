import { inject, Getter } from "@loopback/context";
import { juggler, BelongsToAccessor } from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import { bindAuthorization, PrivateAuthorizationBindings } from "../keys";

import { Group, GroupRelations } from "../models";

@bindAuthorization("GroupRepository")
export class GroupRepository<
    Model extends Group,
    ModelRelations extends GroupRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly parent: BelongsToAccessor<Group, typeof Group.prototype.id>;

    constructor(
        @inject(PrivateAuthorizationBindings.GROUP_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource
    ) {
        super(ctor, dataSource);

        this.parent = this.createBelongsToAccessorFor(
            "parent",
            Getter.fromValue(this)
        );
    }
}
