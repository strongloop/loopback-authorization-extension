import {
    Entity,
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler
} from "@loopback/repository";

import { PermissionRole } from "./../models";

import { PermissionRepository, RoleRepository } from ".";

export class PermissionRoleRepository<
    PermissionModel extends Entity,
    RoleModel extends Entity
> extends DefaultCrudRepository<
    PermissionRole<PermissionModel, RoleModel>,
    typeof PermissionRole.prototype.id
> {
    public readonly permission: BelongsToAccessor<
        PermissionModel,
        typeof PermissionRole.prototype.id
    >;
    public readonly role: BelongsToAccessor<
        RoleModel,
        typeof PermissionRole.prototype.id
    >;

    constructor(
        permissionRepository: PermissionRepository<PermissionModel>,
        roleRepository: RoleRepository<RoleModel>,
        dataSource: juggler.DataSource
    ) {
        super(PermissionRole, dataSource);

        this.permission = this._createBelongsToAccessorFor(
            "permission",
            async () => {
                return permissionRepository;
            }
        );
        this.role = this._createBelongsToAccessorFor("role", async () => {
            return roleRepository;
        });
    }
}
