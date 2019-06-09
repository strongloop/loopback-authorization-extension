import {
    BelongsToAccessor,
    DefaultCrudRepository,
    Getter
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
        Role,
        typeof PermissionRole.prototype.id
    >;

    constructor(
        permissionRepository: PermissionRepository<PermissionModel>,
        roleRepository: RoleRepository<RoleModel>,
        dataSource: any
    ) {
        super(PermissionRole, dataSource);

        let permissionRepositoryGetter: Getter<
            PermissionRepository<PermissionModel>
        > = async () => {
            return permissionRepository;
        };
        let roleRepositoryGetter: Getter<
            RoleRepository<RoleModel>
        > = async () => {
            return roleRepository;
        };

        this.permission = this._createBelongsToAccessorFor(
            "permission",
            permissionRepositoryGetter
        );
        this.role = this._createBelongsToAccessorFor(
            "role",
            roleRepositoryGetter
        );
    }
}
