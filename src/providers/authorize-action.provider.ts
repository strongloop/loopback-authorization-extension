import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";
import { Request } from "@loopback/rest";

import { Condition, And, Or, StringPermissionKey, AuthorizeFn } from "../types";
import { getAuthorizeMetadata } from "../decorators";

export class AuthorizeActionProvider implements Provider<AuthorizeFn> {
    constructor(
        @inject.getter(CoreBindings.CONTROLLER_CLASS)
        private readonly getController: Getter<Constructor<{}>>,
        @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
        private getMethodName: Getter<string>
    ) {}

    async value(): Promise<AuthorizeFn> {
        return async (permissions, request, methodArgs) => {
            let controller = await this.getController();
            let methodName = await this.getMethodName();
            let metadata = getAuthorizeMetadata(controller, methodName);

            return this.authorize(
                metadata,
                permissions,
                request,
                controller,
                methodArgs
            );
        };
    }

    private async authorize(
        conditions: Condition,
        permissions: StringPermissionKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ): Promise<boolean> {
        if (conditions) {
            if ("and" in conditions) {
                for (let condition of (conditions as And).and) {
                    let result = await this.authorize(
                        condition,
                        permissions,
                        request,
                        controller,
                        methodArgs
                    );

                    // lazy evaluation for high performance
                    if (!result) {
                        return false;
                    }
                }

                return true;
            } else if ("or" in conditions) {
                for (let condition of (conditions as Or).or) {
                    let result = await this.authorize(
                        condition,
                        permissions,
                        request,
                        controller,
                        methodArgs
                    );

                    // lazy evaluation for high performance
                    if (result) {
                        return true;
                    }
                }

                return false;
            } else {
                let result = false;

                if (typeof conditions.key === "string") {
                    // string key
                    result = permissions.indexOf(conditions.key) >= 0;
                } else {
                    // async key
                    result = await conditions.key(
                        controller,
                        request,
                        methodArgs
                    );
                }

                return conditions.not ? !result : result;
            }
        }

        return false;
    }
}
