import { Provider } from "@loopback/core";
import { repository } from "@loopback/repository";

import { GetUserPermissionsFn, StringKey } from "../types";

import { Permission, PermissionRelations } from "../models";

import { injectPermissionRepository } from "../keys";
import {
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "../repositories";

export class GetUserPermissionsProvider
    implements Provider<GetUserPermissionsFn> {
    constructor(
        @injectPermissionRepository()
        private permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >[],
        @repository(UserGroupRepository)
        private userGroupRepository: UserGroupRepository,
        @repository(UserRoleRepository)
        private userRoleRepository: UserRoleRepository,
        @repository(GroupRoleRepository)
        private groupRoleRepository: GroupRoleRepository,
        @repository(RolePermissionRepository)
        private rolePermissionRepository: RolePermissionRepository
    ) {}

    async value(): Promise<GetUserPermissionsFn> {
        return async id => {
            return this.getUserPermissions(
                id,
                this.permissionRepository[0],
                this.userGroupRepository,
                this.userRoleRepository,
                this.groupRoleRepository,
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
        userGroupRepository: UserGroupRepository,
        userRoleRepository: UserRoleRepository,
        groupRoleRepository: GroupRoleRepository,
        rolePermissionRepository: RolePermissionRepository
    ) {
        let userGroupsIDs = await this.getUserGroups(id, userGroupRepository);
        let userRolesIDs = await this.getUserRoles(id, userRoleRepository);
        let groupsRolesIDs = await this.getGroupsRoles(
            userGroupsIDs,
            groupRoleRepository
        );

        return await this.getRolesPermissions(
            [...userRolesIDs, ...groupsRolesIDs],
            rolePermissionRepository,
            permissionRepository
        );
    }

    private async getUserGroups(
        userID: string,
        userGroupRepository: UserGroupRepository
    ) {
        const userGroups = await userGroupRepository.find({
            where: {
                user: userID
            }
        });

        return userGroups.map(userGroup => userGroup.group);
    }

    private async getUserRoles(
        userID: string,
        userRoleRepository: UserRoleRepository
    ) {
        const userRoles = await userRoleRepository.find({
            where: {
                user: userID
            }
        });

        return userRoles.map(userRole => userRole.role);
    }

    private async getGroupsRoles(
        groupsIDs: string[],
        groupRoleRepository: GroupRoleRepository
    ) {
        const groupsRoles = await groupRoleRepository.find({
            where: {
                group: {
                    inq: groupsIDs
                }
            }
        });

        return groupsRoles.map(groupsRole => groupsRole.role);
    }

    private async getRolesPermissions(
        rolesIDs: string[],
        rolePermissionRepository: RolePermissionRepository,
        permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >
    ): Promise<StringKey[]> {
        const rolesPermissions = await rolePermissionRepository.find({
            where: {
                role: {
                    inq: rolesIDs
                }
            }
        });

        const permissions = await permissionRepository.find({
            where: {
                id: {
                    inq: rolesPermissions.map(
                        rolesPermission => rolesPermission.permission
                    )
                }
            }
        });

        return permissions.map(permission => permission.key);
    }
}
