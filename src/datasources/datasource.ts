import { juggler } from "@loopback/repository";
import { Options, ModelBuilder } from "loopback-datasource-juggler";

import { bindAuthorization } from "~/keys";

@bindAuthorization("DataSource")
export class DataSource extends juggler.DataSource {
    constructor(settings?: Options, modelBuilder?: ModelBuilder) {
        super(settings, modelBuilder);
    }
}
