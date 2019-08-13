import { inject, Getter, Provider } from "@loopback/core";

import { GetUserPermissionsFn, StringPermissionKey } from "../types";
import { AuthorizationBindings } from "../keys";

import { User, Group, Permission, Role } from "../models";
import {
    UserRepository,
    GroupRepository,
    PermissionRepository,
    RoleRepository,
    UserGroupRepository,
    UserRoleRepository,
    GroupRoleRepository,
    PermissionRoleRepository
} from "../repositories";

export class GetUserPermissionsProvider
    implements Provider<GetUserPermissionsFn> {
    constructor(
        @inject.getter(AuthorizationBindings.USER_REPOSITORY)
        private getUserRepository: Getter<UserRepository<User>>,
        @inject.getter(AuthorizationBindings.GROUP_REPOSITORY)
        private getGroupRepository: Getter<GroupRepository<Group>>,
        @inject.getter(AuthorizationBindings.PERMISSION_REPOSITORY)
        private getPermissionRepository: Getter<
            PermissionRepository<Permission>
        >,
        @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
        private getRoleRepository: Getter<RoleRepository<Role>>
    ) {}

    async value(): Promise<GetUserPermissionsFn> {
        return async id => {
            let userRepository = await this.getUserRepository();
            let groupRepository = await this.getGroupRepository();
            let permissionRepository = await this.getPermissionRepository();
            let roleRepository = await this.getRoleRepository();

            // TODO: implement getUserPermissions logic

            return [];
        };
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
