import { Component, ProviderMap } from "@loopback/core";

import { AuthorizationBindings } from "./keys";
import {
    AuthorizeActionProvider,
    GetUserPermissionsProvider
} from "./providers";

export class AuthorizationComponent implements Component {
    providers?: ProviderMap = {
        [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider,
        [AuthorizationBindings.GET_USER_PERMISSIONS_ACTION
            .key]: GetUserPermissionsProvider
    };
}
