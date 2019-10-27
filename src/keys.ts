import { bind, inject } from "@loopback/core";
import { BindingKey, MetadataAccessor } from "@loopback/context";

import { PermissionsList, AuthorizeFn, GetUserPermissionsFn } from "./types";
import { AuthorizationMetadata } from "./decorators";

/**
 * DataSource bind, inject functions
 */
export function bindDataSource() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ dataSource: true });

        return binding;
    });
}
export function injectDataSource() {
    return inject(binding => {
        return binding.tagMap.authorization && binding.tagMap.dataSource;
    });
}

/**
 * User, Group, Role, Permission repositories bind, inject functions
 */
export function bindUserRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ model: "User" });

        return binding;
    });
}
export function injectUserRepository() {
    return inject(binding => {
        return binding.tagMap.authorization && binding.tagMap.model === "User";
    });
}

export function bindGroupRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ model: "Group" });

        return binding;
    });
}
export function injectGroupRepository() {
    return inject(binding => {
        return binding.tagMap.authorization && binding.tagMap.model === "Group";
    });
}

export function bindRoleRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ model: "Role" });

        return binding;
    });
}
export function injectRoleRepository() {
    return inject(binding => {
        return binding.tagMap.authorization && binding.tagMap.model === "Role";
    });
}

export function bindPermissionRepository() {
    return bind(binding => {
        binding.tag({ authorization: true });
        binding.tag({ model: "Permission" });

        return binding;
    });
}
export function injectPermissionRepository() {
    return inject(binding => {
        return (
            binding.tagMap.authorization &&
            binding.tagMap.model === "Permission"
        );
    });
}

export namespace AuthorizationBindings {
    /**
     * Action Provider key: output
     *  1. AuthorizeFn
     *  2. GetUserPermissionsFn
     *
     */
    export const AUTHORIZE_ACTION = BindingKey.create<
        AuthorizeFn<PermissionsList>
    >("authorization.providers.authorize");
    export const GET_USER_PERMISSIONS_ACTION = BindingKey.create<
        GetUserPermissionsFn<PermissionsList>
    >("authorization.providers.getUserPermissions");
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata<PermissionsList>,
    MethodDecorator
>("authorization.operationsMetadata");
