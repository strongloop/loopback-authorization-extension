import {
    BelongsToAccessor,
    DefaultCrudRepository,
    juggler
} from "@loopback/repository";

import { UserRole, User, Role } from "./../models";

import { UserRepository, RoleRepository } from ".";

export class UserRoleRepository<
    UserModel extends User,
    RoleModel extends Role
> extends DefaultCrudRepository<UserRole, typeof UserRole.prototype.id> {
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
