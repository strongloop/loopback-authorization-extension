import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";

import { Request } from "@loopback/rest";

import {
    Condition,
    And,
    Or,
    Permission,
    PermissionKey,
    AsyncPermissionKey,
    AuthorizeFn
} from "../types";
import { getAuthorizeMetadata } from "../decorators";

export class AuthorizeActionProvider implements Provider<AuthorizeFn> {
    constructor(
        @inject.getter(CoreBindings.CONTROLLER_CLASS)
        private readonly getController: Getter<Constructor<{}>>,
        @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
        private getMethodName: Getter<string>
    ) {}

    async value(): Promise<AuthorizeFn> {
        return async (user, request, methodArgs) => {
            let controller = await this.getController();
            let methodName = await this.getMethodName();
            let metadata = getAuthorizeMetadata(controller, methodName);

            return this.authorize(metadata, request, controller, methodArgs);
        };
    }

    private async authorize(
        conditions: Condition,
        request: Request,
        controller: any,
        args: any[]
    ): Promise<boolean> {
        if (conditions) {
            if ("and" in conditions) {
                for (let condition of (conditions as And).and) {
                    let result = await this.authorize(
                        condition,
                        request,
                        controller,
                        args
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
                        request,
                        controller,
                        args
                    );

                    // lazy evaluation for high performance
                    if (result) {
                        return true;
                    }
                }

                return false;
            } else {
                let result = true;

                // TODO: implement permission key checker for string | AsyncPermissionKey
                if (conditions.type) {
                } else {
                    // return await (conditions as AsyncPermissionKey)(
                    //     controller,
                    //     request,
                    //     args
                    // );
                }

                return result;
            }
        }

        return false;
    }
}
