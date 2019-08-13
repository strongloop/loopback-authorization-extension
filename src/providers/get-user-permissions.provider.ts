import { inject, Getter, Provider } from "@loopback/core";

import { GetUserPermissionsFn, StringPermissionKey } from "../types";
import { AuthorizationBindings } from "../keys";

import {
    UserModel,
    UserModelRelations,
    GroupModel,
    GroupModelRelations,
    RoleModel,
    RoleModelRelations,
    PermissionModel,
    PermissionModelRelations
} from "../models";
import {
    UserModelRepository,
    GroupModelRepository,
    RoleModelRepository,
    PermissionModelRepository,
    UserGroupModelRepository,
    UserRoleModelRepository,
    GroupRoleModelRepository,
    RolePermissionModelRepository
} from "../repositories";

export class GetUserPermissionsProvider
    implements Provider<GetUserPermissionsFn> {
    constructor(
        @inject.getter(AuthorizationBindings.USER_REPOSITORY)
        private getUserRepository: Getter<
            UserModelRepository<UserModel, UserModelRelations>
        >,
        @inject.getter(AuthorizationBindings.GROUP_REPOSITORY)
        private getGroupRepository: Getter<
            GroupModelRepository<GroupModel, GroupModelRelations>
        >,
        @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
        private getRoleRepository: Getter<
            RoleModelRepository<RoleModel, RoleModelRelations>
        >,
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
            const userRepository = await this.getUserRepository();
            const groupRepository = await this.getGroupRepository();
            const roleRepository = await this.getRoleRepository();
            const permissionRepository = await this.getPermissionRepository();
            const userGroupRepository = await this.getUserGroupRepository();
            const userRoleRepository = await this.getUserRoleRepository();
            const groupRoleRepository = await this.getGroupRoleRepository();
            const rolePermissionRepository = await this.getRolePermissionRepository();

            return this.getUserPermissions(
                id,
                userRepository,
                groupRepository,
                roleRepository,
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
        userRepository: UserModelRepository<UserModel, UserModelRelations>,
        groupRepository: GroupModelRepository<GroupModel, GroupModelRelations>,
        roleRepository: RoleModelRepository<RoleModel, RoleModelRelations>,
        permissionRepository: PermissionModelRepository<
            PermissionModel,
            PermissionModelRelations
        >,
        userGroupRepository: UserGroupModelRepository,
        userRoleRepository: UserRoleModelRepository,
        groupRoleRepository: GroupRoleModelRepository,
        rolePermissionRepository: RolePermissionModelRepository
    ) {
        return [];
    }

    private async getUserGroups(): Promise<Group[]> {
        return [];
    }

    private async getUserRoles(): Promise<Role[]> {
        return [];
    }

    private async getGroupRoles(): Promise<Role[]> {
        return [];
    }

    private async getRolePermissions(): Promise<StringPermissionKey[]> {
        return [];
    }
}
