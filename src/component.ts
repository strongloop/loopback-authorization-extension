import {
    Component,
    ProviderMap,
    CoreBindings,
    Application,
    inject
} from "@loopback/core";
import { juggler } from "@loopback/repository";

import { AuthorizationBindings } from "./keys";

import {
    UserModel,
    UserModelRelations,
    GroupModel,
    GroupModelRelations,
    RoleModel,
    RoleModelRelations,
    PermissionModel,
    PermissionModelRelations
} from "./models";
import {
    UserModelRepository,
    GroupModelRepository,
    RoleModelRepository,
    PermissionModelRepository,
    UserGroupModelRepository,
    UserRoleModelRepository,
    GroupRoleModelRepository,
    RolePermissionModelRepository
} from "./repositories";

import { AuthorizeActionProvider } from "./providers";

export class AuthorizationComponent implements Component {
    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE)
        app: Application,
        @inject(AuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject(AuthorizationBindings.USER_REPOSITORY)
        userRepository: UserModelRepository<UserModel, UserModelRelations>,
        @inject(AuthorizationBindings.GROUP_REPOSITORY)
        groupRepository: GroupModelRepository<GroupModel, GroupModelRelations>,
        @inject(AuthorizationBindings.ROLE_REPOSITORY)
        roleRepository: RoleModelRepository<RoleModel, RoleModelRelations>,
        @inject(AuthorizationBindings.PERMISSION_REPOSITORY)
        permissionRepository: PermissionModelRepository<
            PermissionModel,
            PermissionModelRelations
        >
    ) {
        /**
         * Create new Object from:
         *  1. UserGroupModelRepository
         *  2. UserRoleModelRepository
         *  3. GroupRoleModelRepository
         *  4. RolePermissionModelRepository
         *
         * Bind repositories to component application Context
         */
        const userGroupRepository = new UserGroupModelRepository(
            dataSource,
            async () => userRepository,
            async () => groupRepository
        );
        const userRoleRepository = new UserRoleModelRepository(
            dataSource,
            async () => userRepository,
            async () => roleRepository
        );
        const groupRoleRepository = new GroupRoleModelRepository(
            dataSource,
            async () => groupRepository,
            async () => roleRepository
        );
        const rolePermissionRepository = new RolePermissionModelRepository(
            dataSource,
            async () => roleRepository,
            async () => permissionRepository
        );

        app.bind(AuthorizationBindings.USER_GROUP_REPOSITORY).to(
            userGroupRepository
        );
        app.bind(AuthorizationBindings.USER_ROLE_REPOSITORY).to(
            userRoleRepository
        );
        app.bind(AuthorizationBindings.GROUP_ROLE_REPOSITORY).to(
            groupRoleRepository
        );
        app.bind(AuthorizationBindings.ROLE_PERMISSION_REPOSITORY).to(
            rolePermissionRepository
        );
    }

    providers?: ProviderMap = {
        [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider
    };
}
