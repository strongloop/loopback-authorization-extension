import { inject, Getter, Provider } from "@loopback/core";

import { GetUserPermissionsFn, StringPermissionKey } from "../types";
import { AuthorizationBindings } from "../keys";

import { PermissionModel, PermissionModelRelations } from "../models";

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
        @inject.getter(AuthorizationBindings.PERMISSION_REPOSITORY)
        private getPermissionRepository: Getter<
            PermissionModelRepository<PermissionModel, PermissionModelRelations>
        >,
        @inject.getter(AuthorizationBindings.USER_GROUP_REPOSITORY)
        private getUserGroupRepository: Getter<UserGroupModelRepository>,
        @inject.getter(AuthorizationBindings.USER_ROLE_REPOSITORY)
        private getUserRoleRepository: Getter<UserRoleModelRepository>,
        @inject.getter(AuthorizationBindings.GROUP_ROLE_REPOSITORY)
        private getGroupRoleRepository: Getter<GroupRoleModelRepository>,
        @inject.getter(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
        private getRolePermissionRepository: Getter<
            RolePermissionModelRepository
        >
    ) {}

    async value(): Promise<GetUserPermissionsFn> {
        return async id => {
            const permissionRepository = await this.getPermissionRepository();
            const userGroupRepository = await this.getUserGroupRepository();
            const userRoleRepository = await this.getUserRoleRepository();
            const groupRoleRepository = await this.getGroupRoleRepository();
            const rolePermissionRepository = await this.getRolePermissionRepository();

            return this.getUserPermissions(
                id,
                permissionRepository,
                userGroupRepository,
                userRoleRepository,
                groupRoleRepository,
                rolePermissionRepository
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
