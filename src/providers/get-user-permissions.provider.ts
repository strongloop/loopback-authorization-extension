import { Provider } from "@loopback/core";
import { repository } from "@loopback/repository";

import { GetUserPermissionsFn, StringPermissionKey } from "../types";

import { PermissionModel, PermissionModelRelations } from "../models";

import { injectPermissionRepository } from "../keys";
import {
    PermissionModelRepository,
    UserGroupModelRepository,
    UserRoleModelRepository,
    GroupRoleModelRepository,
    RolePermissionModelRepository
} from "../repositories";

export class GetUserPermissionsProvider
    implements Provider<GetUserPermissionsFn> {
    constructor(
        @injectPermissionRepository()
        private permissionRepository: PermissionModelRepository<
            PermissionModel,
            PermissionModelRelations
        >[],
        @repository(UserGroupModelRepository)
        private userGroupRepository: UserGroupModelRepository,
        @repository(UserRoleModelRepository)
        private userRoleRepository: UserRoleModelRepository,
        @repository(GroupRoleModelRepository)
        private groupRoleRepository: GroupRoleModelRepository,
        @repository(RolePermissionModelRepository)
        private rolePermissionRepository: RolePermissionModelRepository
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
        permissionRepository: PermissionModelRepository<
            PermissionModel,
            PermissionModelRelations
        >,
        userGroupRepository: UserGroupModelRepository,
        userRoleRepository: UserRoleModelRepository,
        groupRoleRepository: GroupRoleModelRepository,
        rolePermissionRepository: RolePermissionModelRepository
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
        userGroupRepository: UserGroupModelRepository
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
        userRoleRepository: UserRoleModelRepository
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
        groupRoleRepository: GroupRoleModelRepository
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
        rolePermissionRepository: RolePermissionModelRepository,
        permissionRepository: PermissionModelRepository<
            PermissionModel,
            PermissionModelRelations
        >
    ): Promise<StringPermissionKey[]> {
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
