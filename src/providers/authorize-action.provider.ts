import {
    inject,
    Getter,
    Constructor,
    Provider,
    CoreBindings
} from "@loopback/core";
import { Request, HttpErrors } from "@loopback/rest";

import {
    Condition,
    Permission,
    StringPermissionKey,
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
        return async (permissions, request, methodArgs) => {
            let controller = await this.getController();
            let methodName = await this.getMethodName();
            let metadata = getAuthorizeMetadata(controller, methodName);

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
        permissions: StringPermissionKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ): Promise<boolean> {
        if (condition) {
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
        }

        return false;
    }

    private async authorizeAnd(
        conditions: Condition[],
        permissions: StringPermissionKey[],
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
        conditions: Condition[],
        permissions: StringPermissionKey[],
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
        permission: Permission,
        permissions: StringPermissionKey[],
        request: Request,
        controller: any,
        methodArgs: any[]
    ) {
        let result = false;

        if (typeof permission.key === "string") {
            // string key
            result = permissions.indexOf(permission.key) >= 0;
        } else {
            // async key
            result = await permission.key(controller, request, methodArgs);
        }

        return permission.not ? !result : result;
    }
}
