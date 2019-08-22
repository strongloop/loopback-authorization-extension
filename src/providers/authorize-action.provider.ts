import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";
import { Request, HttpErrors } from "@loopback/rest";

import { Condition, Key, StringKey, AuthorizeFn } from "../types";
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
            let controller: any;
            let methodName: string;
            let metadata: Condition;
            try {
                controller = await this.getController();
                methodName = await this.getMethodName();
                metadata = getAuthorizeMetadata(controller, methodName);
            } catch (error) {
                metadata = {
                    key: async () => {
                        return true;
                    }
                };
            }

            let access = await this.authorize(
                metadata,
                permissions,
                request,
                controller,
                methodArgs
            );

            if (!access) {
                throw new HttpErrors.Forbidden(
                    "You don't have permission to access this endpoint!"
                );
            }
        };
    }

    private async authorize(
        condition: Condition,
        keys: StringKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ): Promise<boolean> {
        if (condition) {
            if ("and" in condition) {
                return await this.authorizeAnd(
                    condition.and,
                    keys,
                    request,
                    controller,
                    methodArgs
                );
            } else if ("or" in condition) {
                return await this.authorizeOr(
                    condition.or,
                    keys,
                    request,
                    controller,
                    methodArgs
                );
            } else {
                return await this.authorizePermission(
                    condition,
                    keys,
                    request,
                    controller,
                    methodArgs
                );
            }
        }

        return false;
    }

    private async authorizeAnd(
        conditions: Condition[],
        keys: StringKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ) {
        // bugfix: for empty arrays return true
        if (conditions.length <= 0) {
            return true;
        }

        for (let condition of conditions) {
            let result = await this.authorize(
                condition,
                keys,
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
    }

    private async authorizeOr(
        conditions: Condition[],
        keys: StringKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ) {
        // bugfix: for empty arrays return true
        if (conditions.length <= 0) {
            return true;
        }

        for (let condition of conditions) {
            let result = await this.authorize(
                condition,
                keys,
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
    }

    private async authorizePermission(
        key: Key,
        keys: StringKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ) {
        let result = false;

        if (typeof key.key === "string") {
            // string key
            result = keys.indexOf(key.key) >= 0;
        } else {
            // async key
            result = await key.key(controller, request, methodArgs);
        }

        return key.not ? !result : result;
    }
}
