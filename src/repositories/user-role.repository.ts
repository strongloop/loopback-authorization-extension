import {
    Entity,
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler
} from "@loopback/repository";

import { UserRole } from "./../models";

import { UserRepository, RoleRepository } from ".";

export class UserRoleRepository<
    UserModel extends Entity,
    RoleModel extends Entity
> extends DefaultCrudRepository<
    UserRole<UserModel, RoleModel>,
    typeof UserRole.prototype.id
> {
    public readonly user: BelongsToAccessor<
        UserModel,
        typeof UserRole.prototype.id
    >;
    public readonly role: BelongsToAccessor<
        RoleModel,
        typeof UserRole.prototype.id
    >;

    constructor(
        userRepository: UserRepository<UserModel>,
        roleRepository: RoleRepository<RoleModel>,
        dataSource: juggler.DataSource
    ) {
        super(UserRole, dataSource);

        this.user = this._createBelongsToAccessorFor("user", async () => {
            return userRepository;
        });
        this.role = this._createBelongsToAccessorFor("role", async () => {
            return roleRepository;
        });
    }
}
