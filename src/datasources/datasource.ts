import { juggler } from "@loopback/repository";

import { bindAuthorization } from "~/keys";

@bindAuthorization("DataSource")
export class DataSource extends juggler.DataSource {}
