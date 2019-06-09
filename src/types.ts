import { Request } from "@loopback/rest";

/**
 * interface definition of a function which accepts a request
 * and authorizes user
 */
// TODO: add `ACLUser` model instead of `any`
export interface AuthorizeFn {
    (user: any, request: Request, methodArgs: any[]): Promise<void>;
}

/**
 * Authorizer `Condition` type system and authorization metadata
 */
export type Condition = And | Or | Permission;
export type And = { and: Condition[] };
export type Or = { or: Condition[] };
export type Permission = { key: PermissionKey; type: boolean };
export type PermissionKey = AsyncPermissionKey | string;
export type AsyncPermissionKey = (
    controller: any,
    request: Request,
    methodArgs: any[]
) => Promise<boolean>;
