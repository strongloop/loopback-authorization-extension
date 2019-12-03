import { inject, Getter } from "@loopback/context";
import { juggler, BelongsToAccessor } from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import { PrivateAuthorizationBindings } from "@authorization/keys";

import { Role, RoleRelations } from "@authorization/models";

export class RoleRepository<
    Model extends Role,
    ModelRelations extends RoleRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly parent: BelongsToAccessor<Role, typeof Role.prototype.id>;

    constructor(
        @inject(PrivateAuthorizationBindings.ROLE_MODEL)
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
