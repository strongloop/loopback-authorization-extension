import {
    MetadataInspector,
    Constructor,
    MethodDecoratorFactory
} from "@loopback/context";

import { Condition } from "../types";
import { AUTHORIZATION_METADATA_KEY } from "../keys";

/**
 * Authorization metadata stored via Reflection API
 */
export type AuthorizationMetadata = Condition;

export function authorize(metadata?: AuthorizationMetadata) {
    return MethodDecoratorFactory.createDecorator<AuthorizationMetadata>(
        AUTHORIZATION_METADATA_KEY,
        metadata || { and: [] }
    );
}

export function getAuthorizeMetadata(
    controllerClass: Constructor<{}>,
    methodName: string
): AuthorizationMetadata {
    return (
        MetadataInspector.getMethodMetadata<AuthorizationMetadata>(
            AUTHORIZATION_METADATA_KEY,
            controllerClass.prototype,
            methodName
        ) || { and: [] }
    );
}
