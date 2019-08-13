import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { UserModel, UserModelRelations } from "../models";
import {} from "@loopback/core";

export class UserModelRepository extends DefaultCrudRepository<
    UserModel,
    typeof UserModel.prototype.id,
    UserModelRelations
> {
    constructor(dataSource: juggler.DataSource) {
        super(UserModel, dataSource);
    }
}
