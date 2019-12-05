import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";
import { Request, HttpErrors } from "@loopback/rest";

import {
    PermissionsList,
    Condition,
    FullKey,
    StringKey,
    AuthorizeFn
} from "~/types";

import { getAuthorizeMetadata } from "~/decorators";

export class AuthorizeActionProvider<Permissions extends PermissionsList>
    implements Provider<AuthorizeFn<Permissions>> {
    constructor(
        @inject.getter(CoreBindings.CONTROLLER_CLASS)
        private readonly getController: Getter<Constructor<{}>>,
        @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
        private getMethodName: Getter<string>
    ) {}

    async value(): Promise<AuthorizeFn<Permissions>> {
        return async (permissions, request, methodArgs) => {
            let controller: any;
            let methodName: string;
            let metadata: Condition<Permissions>;
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
        condition: Condition<Permissions>,
        permissions: StringKey<Permissions>[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ): Promise<boolean> {
        if (condition) {
            if (typeof condition === "object") {
                if ("and" in condition) {
                    return await this.authorizeAnd(
                        condition.and,
                        permissions,
                        request,
                        controller,
                        methodArgs
                    );
                } else if ("or" in condition) {
                    return await this.authorizeOr(
                        condition.or,
                        permissions,
                        request,
                        controller,
                        methodArgs
                    );
                } else {
                    return await this.authorizePermission(
                        condition,
                        permissions,
                        request,
                        controller,
                        methodArgs
                    );
                }
            } else {
                return await this.authorizePermission(
                    { key: condition },
                    permissions,
                    request,
                    controller,
                    methodArgs
                );
            }
        }

        return false;
    }

    private async authorizeAnd(
        conditions: Condition<Permissions>[],
        permissions: StringKey<Permissions>[],
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
    }

    private async authorizeOr(
        conditions: Condition<Permissions>[],
        permissions: StringKey<Permissions>[],
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
    }

    private async authorizePermission(
        key: FullKey<Permissions>,
        permissions: StringKey<Permissions>[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ) {
        let result = false;

        if (typeof key.key === "string") {
            // string key
            result = permissions.indexOf(key.key) >= 0;
        } else if (typeof key.key === "function") {
            // async key
            result = await key.key(controller, request, methodArgs);
        }

        return key.not ? !result : result;
    }
}
