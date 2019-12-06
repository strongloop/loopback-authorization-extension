import { juggler } from "@loopback/repository";
import { inject } from "@loopback/context";
import { Options, ModelBuilder } from "loopback-datasource-juggler";

import { bindAuthorization } from "~/keys";

@bindAuthorization("DataSource")
export class DataSource extends juggler.DataSource {
    constructor(
        @inject("private.authorization.dataSources.dataSource.settings", {
            optional: true
        })
        settings?: Options,
        @inject("private.authorization.dataSources.dataSource.modelBuilder", {
            optional: true
        })
        modelBuilder?: ModelBuilder
    ) {
        super(settings, modelBuilder);
    }
}
