import { BindingKey, MetadataAccessor } from "@loopback/context";

import { AuthorizeFn } from "./types";

import { AuthorizationMetadata } from "./decorators";

export namespace AuthorizationBindings {
    export const AUTHORIZE_ACTION = BindingKey.create<AuthorizeFn>(
        "authorization.actions.authorize"
    );
}

export const AUTHORIZATION_METADATA_KEY = MetadataAccessor.create<
    AuthorizationMetadata,
    MethodDecorator
>("authorization.operationsMetadata");
