import { inject, Getter } from "@loopback/context";
import { juggler, HasManyRepositoryFactory } from "@loopback/repository";
import { Ctor, HistoryCrudRepository } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { User, UserRelations, UserRole, UserRoleRelations } from "../models";

import { UserRoleRepository } from "./";

@bindAuthorization("UserRepository")
export class UserRepository<
    Model extends User,
    ModelRelations extends UserRelations
> extends HistoryCrudRepository<Model, ModelRelations> {
    public readonly userRoles: HasManyRepositoryFactory<
        UserRole,
        typeof User.prototype.id
    >;

    constructor(
        @inject(PrivateAuthorizationBindings.USER_MODEL)
        ctor: Ctor<Model>,
        @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
        dataSource: juggler.DataSource,
        @inject.getter(AuthorizationBindings.USER_ROLE_REPOSITORY)
        getUserRoleRepository: Getter<
            UserRoleRepository<UserRole, UserRoleRelations>
        >
    ) {
        super(ctor, dataSource);

        this.userRoles = this.createHasManyRepositoryFactoryFor(
            "userRoles",
            getUserRoleRepository
        );
        this.registerInclusionResolver(
            "userRoles",
            this.userRoles.inclusionResolver
        );
    }
}
