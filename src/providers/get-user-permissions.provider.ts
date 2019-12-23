import { inject, Provider } from "@loopback/core";

import { AuthorizationBindings } from "../keys";

import { PermissionsList, GetUserPermissionsFn, StringKey } from "../types";

import {
    User,
    UserRelations,
    Role,
    RoleRelations,
    Permission,
    PermissionRelations
} from "../models";
import {
    UserRepository,
    RoleRepository,
    PermissionRepository,
    UserRoleRepository,
    RolePermissionRepository
} from "../repositories";

export class GetUserPermissionsProvider<Permissions extends PermissionsList>
    implements Provider<GetUserPermissionsFn<Permissions>> {
    constructor(
        @inject(AuthorizationBindings.USER_REPOSITORY)
        private userRepository: UserRepository<User, UserRelations>,
        @inject(AuthorizationBindings.ROLE_REPOSITORY)
        private roleRepository: RoleRepository<Role, RoleRelations>,
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
                this.userRepository,
                this.roleRepository,
                this.permissionRepository,
                this.userRoleRepository,
                this.rolePermissionRepository
            );
        };
    }

    private async getUserPermissions(
        id: string,
        userRepository: UserRepository<User, UserRelations>,
        roleRepository: RoleRepository<Role, RoleRelations>,
        permissionRepository: PermissionRepository<
            Permission,
            PermissionRelations
        >,
        userRoleRepository: UserRoleRepository,
        rolePermissionRepository: RolePermissionRepository
    ) {
        const user = await this.userRepository.findById(id, {
            include: [{ relation: "userRoles" }]
        });
        user.userRoles.map(userRole => userRole.);

        const userRolesIDs = await this.getUserRoles(id, userRoleRepository);

        const rolesIDs = await this.getParentRoles(
            userRolesIDs,
            roleRepository
        );

        return await this.getRolesPermissions(
            [...rolesIDs],
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

    private async getParentRoles(
        rolesIDs: string[],
        roleRepository: RoleRepository<Role, RoleRelations>
    ) {
        let result = [];

        /**
         * 1. Get role IDs
         * 2. Find parents IDs
         * 3. Filter parents IDs
         * 4. Until we have parents
         *      5. Push parents IDs
         *      6. Get parents
         */
        let parentsIDs = rolesIDs;
        while (parentsIDs.length > 0) {
            result.push(...parentsIDs);

            const roles = await roleRepository.find({
                where: {
                    id: {
                        inq: parentsIDs
                    }
                }
            });

            parentsIDs = roles
                .map(role => role.parentId)
                .filter(parentId => Boolean(parentId));
        }

        return result;
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
