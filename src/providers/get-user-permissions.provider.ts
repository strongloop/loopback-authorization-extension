import { inject, Provider } from "@loopback/core";

import { AuthorizationBindings } from "~/keys";

import { PermissionsList, GetUserPermissionsFn, StringKey } from "~/types";

import { Permission, PermissionRelations } from "~/models";
import {
    PermissionRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    RolePermissionRepository
} from "~/repositories";

export class GetUserPermissionsProvider<Permissions extends PermissionsList>
    implements Provider<GetUserPermissionsFn<Permissions>> {
    constructor(
        @inject(AuthorizationBindings.PERMISSION_REPOSITORY)
        private permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >,
        @inject(AuthorizationBindings.USER_GROUP_REPOSITORY)
        private userGroupRepository: UserGroupRepository,
        @inject(AuthorizationBindings.USER_ROLE_REPOSITORY)
        private userRoleRepository: UserRoleRepository,
        @inject(AuthorizationBindings.GROUP_ROLE_REPOSITORY)
        private groupRoleRepository: GroupRoleRepository,
        @inject(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY)
        private rolePermissionRepository: RolePermissionRepository
    ) {}

    async value(): Promise<GetUserPermissionsFn<Permissions>> {
        return async id => {
            return this.getUserPermissions(
                id,
                this.permissionRepository,
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
                userId: userID
            }
        });

        return userGroups.map(userGroup => userGroup.groupId);
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

    private async getGroupsRoles(
        groupsIDs: string[],
        groupRoleRepository: GroupRoleRepository
    ) {
        const groupsRoles = await groupRoleRepository.find({
            where: {
                groupId: {
                    inq: groupsIDs
                }
            }
        });

        return groupsRoles.map(groupsRole => groupsRole.roleId);
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
