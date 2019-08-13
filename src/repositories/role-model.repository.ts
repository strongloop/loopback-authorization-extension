import {
    DefaultCrudRepository,
    BelongsToAccessor,
    juggler
} from "@loopback/repository";
import { RoleModel, RoleModelRelations } from "../models";
import { Getter } from "@loopback/core";

export class RoleModelRepository<
    Role extends RoleModel,
    RoleRelations extends RoleModelRelations
> extends DefaultCrudRepository<
    Role,
    typeof RoleModel.prototype.id,
    RoleRelations
> {
    public readonly roleModel: BelongsToAccessor<
        Role,
        typeof RoleModel.prototype.id
    >;

    constructor(
        entityClass: typeof RoleModel & {
            prototype: Role;
        },
        dataSource: juggler.DataSource,
        roleModelRepositoryGetter: Getter<
            RoleModelRepository<Role, RoleRelations>
        >
    ) {
        super(entityClass, dataSource);
        this.roleModel = this.createBelongsToAccessorFor(
            "parent",
            roleModelRepositoryGetter
        );
    }
}
