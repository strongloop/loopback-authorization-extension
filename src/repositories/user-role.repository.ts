import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    BelongsToAccessor,
    DefaultCrudRepository
} from "@loopback/repository";
import { Ctor, HistoryCrudRepositoryMixin } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { UserRole, UserRoleRelations, User, Role } from "../models";

import { DefaultUserRepository, DefaultRoleRepository } from "./";

export function UserRoleRepositoryMixin<
    Model extends UserRole,
    ModelRelations extends UserRoleRelations
>(): Class<DefaultCrudRepository<Model, string, ModelRelations>> {
    @bindAuthorization("UserRoleRepository")
    class UserRoleRepository extends HistoryCrudRepositoryMixin<
        Model,
        ModelRelations
    >() {
        public readonly user: BelongsToAccessor<
            User,
            typeof UserRole.prototype.id
        >;

        public readonly role: BelongsToAccessor<
            Role,
            typeof UserRole.prototype.id
        >;

        constructor(
            @inject(PrivateAuthorizationBindings.USER_ROLE_MODEL)
            ctor: Ctor<Model>,
            @inject(PrivateAuthorizationBindings.RELATIONAL_DATASOURCE)
            dataSource: juggler.DataSource,
            @inject.getter(AuthorizationBindings.USER_REPOSITORY)
            getUserRepository: Getter<DefaultUserRepository>,
            @inject.getter(AuthorizationBindings.ROLE_REPOSITORY)
            getRoleRepository: Getter<DefaultRoleRepository>
        ) {
            super(ctor, dataSource);

            this.user = this.createBelongsToAccessorFor(
                "user",
                getUserRepository
            );
            this.registerInclusionResolver("user", this.user.inclusionResolver);

            this.role = this.createBelongsToAccessorFor(
                "role",
                getRoleRepository
            );
            this.registerInclusionResolver("role", this.role.inclusionResolver);
        }
    }

    return UserRoleRepository;
}

export class DefaultUserRoleRepository extends UserRoleRepositoryMixin<
    UserRole,
    UserRoleRelations
>() {}
