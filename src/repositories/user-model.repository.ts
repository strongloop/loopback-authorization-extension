import { DefaultCrudRepository } from "@loopback/repository";
import { UserModel, UserModelRelations } from "../models";
import { MySqlDataSource } from "../datasources";
import { inject } from "@loopback/core";

export class UserModelRepository extends DefaultCrudRepository<
    UserModel,
    typeof UserModel.prototype.id,
    UserModelRelations
> {
    constructor(@inject("datasources.MySQL") dataSource: MySqlDataSource) {
        super(UserModel, dataSource);
    }
}
