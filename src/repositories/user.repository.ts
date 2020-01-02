import { inject, Getter } from "@loopback/context";
import {
    juggler,
    Class,
    HasManyRepositoryFactory,
    DefaultCrudRepository
} from "@loopback/repository";
import { Ctor, HistoryCrudRepositoryMixin } from "loopback-history-extension";

import {
    bindAuthorization,
    AuthorizationBindings,
    PrivateAuthorizationBindings
} from "../keys";

import { User, UserRelations, UserRole } from "../models";

import { DefaultUserRoleRepository } from "./";

export function UserRepositoryMixin<
    Model extends User,
    ModelRelations extends UserRelations
>(): Class<DefaultCrudRepository<Model, string, ModelRelations>> {
    @bindAuthorization("UserRepository")
    class UserRepository extends HistoryCrudRepositoryMixin<
        Model,
        ModelRelations
    >() {
        public readonly userRoles: HasManyRepositoryFactory<
            UserRole,
            typeof User.prototype.id
        >;

        constructor(
            @inject(PrivateAuthorizationBindings.USER_MODEL)
            ctor: Ctor<Model>,
            @inject(PrivateAuthorizationBindings.DATASOURCE)
            dataSource: juggler.DataSource,
            @inject.getter(AuthorizationBindings.USER_ROLE_REPOSITORY)
            getUserRoleRepository: Getter<DefaultUserRoleRepository>
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

    return UserRepository;
}

export class DefaultUserRepository extends UserRepositoryMixin<
    User,
    UserRelations
>() {}
