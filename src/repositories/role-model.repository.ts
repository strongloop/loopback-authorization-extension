import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";
import { RoleModel, RoleModelRelations } from "../models";
import { Getter } from "@loopback/core";

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
        dataSource: juggler.DataSource,
        roleModelRepositoryGetter: Getter<RoleModelRepository>
    ) {
        super(RoleModel, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "parent",
            roleModelRepositoryGetter
        );
    }
}
