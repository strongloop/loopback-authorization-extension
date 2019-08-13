// import { Component, inject, CoreBindings, Application } from "@loopback/core";
// import { Entity, juggler } from "@loopback/repository";

// import { AuthorizationBindings } from "./keys";

// import {
//     UserRepository,
//     GroupRepository,
//     PermissionRepository,
//     RoleRepository,
//     UserGroupRepository,
//     UserRoleRepository,
//     GroupRoleRepository,
//     PermissionRoleRepository
// } from "./src/repositories";

// import { AuthorizeActionProvider } from "./providers";

// export class AuthorizationComponent<
//     UserModel extends Entity,
//     GroupModel extends Entity,
//     PermissionModel extends Entity,
//     RoleModel extends Entity
// > implements Component {
//     constructor(
//         @inject(CoreBindings.APPLICATION_INSTANCE)
//         app: Application,
//         @inject(AuthorizationBindings.USER_MODEL)
//         userCtor: typeof Entity & { prototype: UserModel },
//         @inject(AuthorizationBindings.GROUP_MODEL)
//         groupCtor: typeof Entity & { prototype: GroupModel },
//         @inject(AuthorizationBindings.PERMISSION_MODEL)
//         permissionCtor: typeof Entity & { prototype: PermissionModel },
//         @inject(AuthorizationBindings.ROLE_MODEL)
//         roleCtor: typeof Entity & { prototype: RoleModel },
//         @inject(AuthorizationBindings.DATASOURCE)
//         dataSource: juggler.DataSource
//     ) {
//         /**
//          * Create new Object from:
//          *  1. UserRepository
//          *  2. GroupRepository
//          *  3. PermissionRepository
//          *  4. RoleRepository
//          *
//          * Bind repositories to component level Context
//          */
//         let userRepository = new UserRepository<UserModel>(
//             userCtor,
//             dataSource
//         );
//         let groupRepository = new GroupRepository<Group>(groupCtor, dataSource);
//         let permissionRepository = new PermissionRepository<Permission>(
//             permissionCtor,
//             dataSource
//         );
//         let roleRepository = new RoleRepository<Role>(roleCtor, dataSource);

//         /**
//          * Create new Object from:
//          *  1. UserGroupRepository
//          *  2. UserRoleRepository
//          *  3. GroupRoleRepository
//          *  4. PermissionRoleRepository
//          *
//          * Bind repositories to component level Context
//          */
//         let userGroupRepository = new UserGroupRepository<User, Group>(
//             userRepository,
//             groupRepository,
//             dataSource
//         );
//         let userRoleRepository = new UserRoleRepository<User, Role>(
//             userRepository,
//             roleRepository,
//             dataSource
//         );
//         let groupRoleRepository = new GroupRoleRepository<Group, Role>(
//             groupRepository,
//             roleRepository,
//             dataSource
//         );
//         let permissionRoleRepository = new PermissionRoleRepository<
//             Permission,
//             Role
//         >(permissionRepository, roleRepository, dataSource);

//         app.bind(AuthorizationBindings.USER_REPOSITORY).to(userRepository);
//         app.bind(AuthorizationBindings.GROUP_REPOSITORY).to(groupRepository);
//         app.bind(AuthorizationBindings.PERMISSION_REPOSITORY).to(
//             permissionRepository
//         );
//         app.bind(AuthorizationBindings.ROLE_REPOSITORY).to(roleRepository);
//         app.bind(AuthorizationBindings.USER_GROUP_REPOSITORY).to(
//             userGroupRepository
//         );
//         app.bind(AuthorizationBindings.USER_ROLE_REPOSITORY).to(
//             userRoleRepository
//         );
//         app.bind(AuthorizationBindings.GROUP_ROLE_REPOSITORY).to(
//             groupRoleRepository
//         );
//         app.bind(AuthorizationBindings.PERMISSION_ROLE_REPOSITORY).to(
//             permissionRoleRepository
//         );
//     }

//     providers? = {
//         [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider
//     };
// }
