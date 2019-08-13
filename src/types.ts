import { Request } from "@loopback/rest";

/**
 * interface definition of a function which accepts a request
 * and authorizes user
 */
export interface AuthorizeFn {
    (
        permissions: StringPermissionKey[],
        request: Request,
        methodArgs: any[]
    ): Promise<boolean>;
}

/**
 * interface definition of a function which accepts a user id
 * and finds it's permission
 */
export interface GetUserPermissionsFn {
    (id: string): Promise<StringPermissionKey[]>;
}

/**
 * Authorizer `Condition` type system and authorization metadata
 */
export type Condition = And | Or | Permission;
export type And = { and: Condition[] };
export type Or = { or: Condition[] };
export type Permission = { key: PermissionKey; not?: true };
export type PermissionKey = StringPermissionKey | AsyncPermissionKey;
export type StringPermissionKey = string;
export type AsyncPermissionKey = (
    controller: any,
    request: Request,
    methodArgs: any[]
) => Promise<boolean>;
