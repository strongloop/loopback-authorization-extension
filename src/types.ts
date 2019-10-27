import { Request } from "@loopback/rest";

/**
 * interface definition of a function which accepts a request
 * and authorizes user
 */
export interface AuthorizeFn {
    (permissions: StringKey[], request: Request, methodArgs: any[]): Promise<
        void
    >;
}

/**
 * interface definition of a function which accepts a user id
 * and finds it's permission
 */
export interface GetUserPermissionsFn {
    (id: string): Promise<StringKey[]>;
}

/**
 * Authorizer `Condition` type system and authorization metadata
 */
export type Condition = And | Or | FullKey | Key;
export type And = {
    and: Condition[];
};
export type Or = {
    or: Condition[];
};
export type FullKey = {
    key: Key;
    not?: true;
};
export type Key = StringKey | AsyncKey;
export type StringKey = keyof Permissions;
export type AsyncKey = (
    controller: any,
    request: Request,
    methodArgs: any[]
) => Promise<boolean>;
