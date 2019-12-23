import { inject, Getter } from "@loopback/context";
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
import { UserRepository, RoleRepository } from "../repositories";

export class UserRoleRepository extends HistoryCrudRepository<
    UserRole,
    UserRoleRelations
> {
    public readonly user: BelongsToAccessor<User, typeof UserRole.prototype.id>;

    public readonly role: BelongsToAccessor<Role, typeof UserRole.prototype.id>;

    constructor(
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject.getter(AuthorizationBindings.USER_REPOSITORY)
        getUserRepository: Getter<UserRepository<User, UserRelations>>,
        @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
        getRoleRepository: Getter<RoleRepository<Role, RoleRelations>>
    ) {
        super(UserRole, dataSource);

        this.user = this.createBelongsToAccessorFor("user", getUserRepository);
        this.role = this.createBelongsToAccessorFor("role", getRoleRepository);
    }
}
