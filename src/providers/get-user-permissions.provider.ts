import { inject, Provider } from "@loopback/core";

import { AuthorizationBindings } from "../keys";

import { PermissionsList, GetUserPermissionsFn, StringKey } from "../types";

import { Permission, PermissionRelations } from "../models";
import {
    PermissionRepository,
    UserRoleRepository,
    RolePermissionRepository
} from "../repositories";

export class GetUserPermissionsProvider<Permissions extends PermissionsList>
    implements Provider<GetUserPermissionsFn<Permissions>> {
    constructor(
        @inject(AuthorizationBindings.PERMISSION_REPOSITORY)
        private permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >,
        @inject(AuthorizationBindings.USER_ROLE_REPOSITORY)
        private userRoleRepository: UserRoleRepository,
        @inject(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
        private rolePermissionRepository: RolePermissionRepository
    ) {}

    async value(): Promise<GetUserPermissionsFn<Permissions>> {
        return async id => {
            return this.getUserPermissions(
                id,
                this.permissionRepository,
                this.userRoleRepository,
                this.rolePermissionRepository
            );
        };
    }

    private async getUserPermissions(
        id: string,
        permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >,
        userRoleRepository: UserRoleRepository,
        rolePermissionRepository: RolePermissionRepository
    ) {
        let userRolesIDs = await this.getUserRoles(id, userRoleRepository);

        return await this.getRolesPermissions(
            [...userRolesIDs],
            rolePermissionRepository,
            permissionRepository
        );
    }

    private async getUserRoles(
        userID: string,
        userRoleRepository: UserRoleRepository
    ) {
        const userRoles = await userRoleRepository.find({
            where: {
                userId: userID
            }
        });

        return userRoles.map(userRole => userRole.roleId);
    }

    private async getRolesPermissions(
        rolesIDs: string[],
        rolePermissionRepository: RolePermissionRepository,
        permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >
    ): Promise<StringKey<Permissions>[]> {
        const rolesPermissions = await rolePermissionRepository.find({
            where: {
                roleId: {
                    inq: rolesIDs
                }
            }
        });

        const permissions = await permissionRepository.find({
            where: {
                id: {
                    inq: rolesPermissions.map(
                        rolesPermission => rolesPermission.permissionId
                    )
                }
            }
        });

        return permissions.map(
            permission => permission.key as keyof Permissions
        );
    }
}
