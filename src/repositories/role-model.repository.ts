import {
    DefaultCrudRepository,
    repository,
    BelongsToAccessor
} from "@loopback/repository";
import { RoleModel, RoleModelRelations } from "../models";
import { MySqlDataSource } from "../datasources";
import { inject, Getter } from "@loopback/core";

export class RoleModelRepository extends DefaultCrudRepository<
    RoleModel,
    typeof RoleModel.prototype.id,
    RoleModelRelations
> {
    public readonly roleModel: BelongsToAccessor<
        RoleModel,
        typeof RoleModel.prototype.id
    >;

    constructor(
        @inject("datasources.MySQL") dataSource: MySqlDataSource,
        @repository.getter("RoleModelRepository")
        protected roleModelRepositoryGetter: Getter<RoleModelRepository>
    ) {
        super(RoleModel, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "parent",
            roleModelRepositoryGetter
        );
    }
}
