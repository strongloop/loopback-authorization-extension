import {
    BelongsToAccessor,
    DefaultCrudRepository,
    Getter
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
    public readonly role: BelongsToAccessor<Role, typeof UserRole.prototype.id>;

    constructor(
        userRepository: UserRepository<UserModel>,
        roleRepository: RoleRepository<RoleModel>,
        dataSource: any
    ) {
        super(UserRole, dataSource);

        let userRepositoryGetter: Getter<
            UserRepository<UserModel>
        > = async () => {
            return userRepository;
        };
        let roleRepositoryGetter: Getter<
            RoleRepository<RoleModel>
        > = async () => {
            return roleRepository;
        };

        this.user = this._createBelongsToAccessorFor(
            "user",
            userRepositoryGetter
        );
        this.role = this._createBelongsToAccessorFor(
            "role",
            roleRepositoryGetter
        );
    }
}
