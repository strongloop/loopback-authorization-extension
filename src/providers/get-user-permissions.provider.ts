import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";

import { GetUserPermissionsFn } from "../types";

export class GetUserPermissionsProvider
    implements Provider<GetUserPermissionsFn> {
    constructor(
        @inject.getter(CoreBindings.CONTROLLER_CLASS)
        private readonly getController: Getter<Constructor<{}>>,
        @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
        private getMethodName: Getter<string>
    ) {}

    async value(): Promise<GetUserPermissionsFn> {
        return async id => {
            return [];
        };
    }
}
