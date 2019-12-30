import { inject, Getter } from "@loopback/context";
import { juggler, BelongsToAccessor } from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import {
    UserRole,
    UserRoleRelations,
    User,
    UserRelations,
    Role,
    RoleRelations
} from "../models";

import { UserRepository, RoleRepository } from "./";

@bindAuthorization("UserRoleRepository")
export class UserRoleRepository<
    Model extends UserRole,
    ModelRelations extends UserRoleRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly user: BelongsToAccessor<User, typeof UserRole.prototype.id>;

    public readonly role: BelongsToAccessor<Role, typeof UserRole.prototype.id>;

    constructor(
        @inject(PrivateAuthorizationBindings.USER_ROLE_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.DATASOURCE)
        dataSource: juggler.DataSource,
        @inject.getter(AuthorizationBindings.USER_REPOSITORY)
        getUserRepository: Getter<UserRepository<User, UserRelations>>,
        @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
        getRoleRepository: Getter<RoleRepository<Role, RoleRelations>>
    ) {
        super(ctor, dataSource);

        this.user = this.createBelongsToAccessorFor("user", getUserRepository);
        this.registerInclusionResolver("user", this.user.inclusionResolver);

        this.role = this.createBelongsToAccessorFor("role", getRoleRepository);
        this.registerInclusionResolver("role", this.role.inclusionResolver);
    }
}
