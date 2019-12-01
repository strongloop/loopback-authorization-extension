import { inject } from "@loopback/context";
import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import { PrivateAuthorizationBindings, AuthorizationBindings } from "../keys";
import {
    UserRole,
    UserRoleRelations,
    User,
    UserRelations,
    Role,
    RoleRelations
} from "../models";
import { UserRepository, RoleRepository } from ".";

export class UserRoleRepository extends HistoryCrudRepository<
    UserRole,
    UserRoleRelations
> {
    public readonly user: BelongsToAccessor<User, typeof UserRole.prototype.id>;

    public readonly role: BelongsToAccessor<Role, typeof UserRole.prototype.id>;

    constructor(
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject(AuthorizationBindings.USER_REPOSITORY)
        userRepository: UserRepository<User, UserRelations>,
        @inject(AuthorizationBindings.ROLE_REPOSITORY)
        roleRepository: RoleRepository<Role, RoleRelations>
    ) {
        super(UserRole, dataSource);

        this.user = this.createBelongsToAccessorFor(
            "user",
            async () => userRepository
        );
        this.role = this.createBelongsToAccessorFor(
            "role",
            async () => roleRepository
        );
    }
}
