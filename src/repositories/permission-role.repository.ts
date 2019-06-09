import {
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler
} from "@loopback/repository";

import { PermissionRole, Permission, Role } from "./../models";

import { PermissionRepository, RoleRepository } from ".";

export class PermissionRoleRepository<
    PermissionModel extends Permission,
    RoleModel extends Role
> extends DefaultCrudRepository<
    PermissionRole,
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
