import { BelongsToAccessor, juggler } from "@loopback/repository";
import { HistoryCrudRepository } from "loopback-history-extension";

import {
    injectDataSource,
    injectUserRepository,
    injectRoleRepository
} from "../keys";
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
        @injectDataSource()
        dataSource: juggler.DataSource[],
        @injectUserRepository()
        userRepository: UserRepository<User, UserRelations>[],
        @injectRoleRepository()
        roleRepository: RoleRepository<Role, RoleRelations>[]
    ) {
        super(UserRole, dataSource[0]);

        this.user = this.createBelongsToAccessorFor(
            "user",
            async () => userRepository[0]
        );
        this.role = this.createBelongsToAccessorFor(
            "role",
            async () => roleRepository[0]
        );
    }
}
