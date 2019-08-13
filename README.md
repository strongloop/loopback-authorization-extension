# loopback-authorization-extension

Access controlling is one of the most important parts of every application, there are many kinds of models for access controlling like `MAC (Mandatory Access Control)`, `DAC (Discretionary Access Control)`, `RBAC (Role Based Access Control)` and etc (for more information about access models see [this link](https://searchsecurity.techtarget.com/definition/access-control))

`loopback-authorization-extension` is a powerful and generic implementation of `HRBAC (Hierarchical Role Based Access Control)` access model

## Installation

```bash
npm i --save loopback-authorization-extension
```

## Usage

Follow these steps to add `authorization` extension to your loopback4 application

1. define `User`, `Group`, `Role`, `Permission` models
2. define `User`, `Group`, `Role`, `Permission` repositories
3. bind your `dataSource` to `AuthorizationBindings.DATASOURCE` key
4. bind your `repositories` to `AuthorizationBindings.X_REPOSITORY` key
5. bind the `AuthorizationComponent`
6. add `AuthorizationActionProvider` to your custom http sequence handler
7. use `GetUserPermissionsProvider` to find user permissions when `signin` and `save` the permissions in user's session

Now, let's try these

### Step 1 (Adding Models)

Use the command `lb4 model` for simplifing your `Entity` model creation, then just replace `Entity` class with `UserModel`, `GroupModel`, `RoleModel` or `PermissionModel` as the parent class

See this example:

```js
import { model, property } from "@loopback/repository";
import {
    UserModel,
    UserModelRelations
} from "loopback-authorization-extension";

@model({ settings: {} })
export class User extends UserModel {
    @property({
        type: "string"
    })
    name?: string;

    @property({
        type: "number"
    })
    age?: number;

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations extends UserModelRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

```

---

### Step 2 (Adding Repositories)

Use the command `lb4 repository` for simplifing your `Repository` creation, then just replace `DefaultCrudRepository` class with `UserModelRepository`, `GroupModelRepository`, `RoleModelRepository` or `PermissionModelRepository` as the parent class

See this example:

```js
import { Group, GroupRelations } from "../models";
import { MySqlDataSource } from "../datasources";
import { inject } from "@loopback/core";

import { GroupModelRepository } from "loopback-authorization-extension";

export class GroupRepository extends GroupModelRepository<
    Group,
    GroupRelations
> {
    constructor(@inject("datasources.MySQL") dataSource: MySqlDataSource) {
        super(Group, dataSource);
    }
}
```

---

### Step 3,4,5

Edit your `application.ts` file:

```js
import {
    AuthorizationBindings,
    AuthorizationComponent
} from "loopback-authorization-extension";

import { MySqlDataSource } from "./datasources";
import {
    UserRepository,
    GroupRepository,
    RoleRepository,
    PermissionRepository
} from "./repositories";

export class TestApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication))
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);

        // Set up the custom sequence
        this.sequence(MySequence);

        // Set up default home page
        this.static("/", path.join(__dirname, "../public"));

        // ...

        // bind dataSource, repositories, component to your application context
        const dataSource = new MySqlDataSource();
        this.bind(AuthorizationBindings.DATASOURCE).to(dataSource);
        this.bind(AuthorizationBindings.USER_REPOSITORY).to(
            new UserRepository(dataSource)
        );
        this.bind(AuthorizationBindings.GROUP_REPOSITORY).to(
            new GroupRepository(dataSource)
        );
        this.bind(AuthorizationBindings.ROLE_REPOSITORY).to(
            new RoleRepository(dataSource)
        );
        this.bind(AuthorizationBindings.PERMISSION_REPOSITORY).to(
            new PermissionRepository(dataSource)
        );
        this.component(AuthorizationComponent);

        // ...

        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ["controllers"],
                extensions: [".controller.js"],
                nested: true
            }
        };
    }
}
```

---

### Step 6

Then edit your `sequence.ts` file:

```js
import {
    AuthorizationBindings,
    AuthorizeFn
} from "loopback-authorization-extension";

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS)
        protected parseParams: ParseParams,
        // add the AuthorizeActionProvider
        @inject(AuthorizationBindings.AUTHORIZE_ACTION)
        protected authorize: AuthorizeFn,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) public send: Send,
        @inject(SequenceActions.REJECT) public reject: Reject
    ) {}

    async handle(context: RequestContext) {
        try {
            const { request, response } = context;
            const route = this.findRoute(request);
            const args = await this.parseParams(request, route);

            // use `@loopback/authentication` module
            const userSession = await this.authenticate(...);

            // ["CREATE_USER", "READ_USER", ...]
            const userPermissions = userSession.permissions;

            // check user permissions
            /*
            * User permissions will pass to this method,
            * they are loaded before using `getUserPermissions(id)`
            * action on `sign-in` step of your application,
            * then your must save them in the client's session
            * and at the end your must pass them to this method
            */
            await this.authorize(userPermissions, request, args);

            const result = await this.invoke(route, args);
            this.send(response, result);
        } catch (err) {
            this.reject(context, err);
        }
    }
}
```

> If the client doesn't have correct permissions, will see `Http Forbidden (403)` error code

---

### Step 7

At the final step you must get user permissions using `getUserPermissions(id)` provider and save it in the user's session or token

```js
import {
    Count,
    CountSchema,
    Filter,
    repository,
    Where
} from "@loopback/repository";
import {
    post,
    param,
    get,
    getFilterSchemaFor,
    getModelSchemaRef,
    getWhereSchemaFor,
    patch,
    put,
    del,
    requestBody
} from "@loopback/rest";
import { User } from "../models";
import { UserRepository } from "../repositories";

import {
    AuthorizationBindings,
    GetUserPermissionsFn,
    authorize
} from "loopback-authorization-extension";
import { inject } from "@loopback/context";

export class SignInController {
    constructor(
        @inject(AuthorizationBindings.GET_USER_PERMISSIONS_ACTION)
        protected getUserPermissions: GetUserPermissionsFn,
    ) {}

    // ...

    @post("/signin", {
        responses: {
            "200": {
                //...
            }
        }
    })
    async signIn(...args): Promise<Session> {
        // authentication
        // ...

        // authorization
        const permissions = await this.getUserPermissions(id);

        return this.sessionRepository.create(new Session({
            //...
            permissions: permissions
        }));
    }

    // ...
}

```

---

### Controllers

Now `authorization` extension is fully added and you can protect your endpoints using `@authorize` decorator

You can feel the power of `loopback-authorization-extension` is in this step, by using `And` types, `Or` types, `Async Authorizers`

```js
// ...

@authorize({
    and: [
        {key: "CREATE_USER"},
        {key: "DELETE_USER"}
    ]
})
@authenticate(...)
async editUser(...args): Promise<any> {...}

// ...
```

---

## More about `@authorize`

This decorator accepts an object of type `And` or `Or` or `StringPermissionKey` or `AsyncPermissionKey`

your can define any logical combinations of your `Permissions` to control access much better

**Example**:

```js
{
    and: [
        { key: "A" },
        { key: "B" },
        { key: "C", not: true },
        { or: [{ key: "D" }, { key: "E" }] }
    ];
}
```

### AsyncAuthorizer

In some special cases we need to check some other permissions or conditions such as querying in database or etc, for these cases we can use `AsyncAuthorizer` for running an async function of type `(controller,req,args) => boolean`

**Example**:

```js
{
    or: [
        {
            and: [
                {key: "A"},
                {key: "B"}
            ]
        },
        {
            key: async (controller, req, args) => {
                let result = await controller.userRepository.find({...});

                if (result.length > 0) {
                    return true;
                }

                return false;
            }
        }
    ]
}
```

---

## How to define `Users, Groups, Roles, Permissions`

Everywhere you can inject the authorizer repositories such as `UserModelRepository`, `GroupModelRepository`, etc and edit your models in database

```js
import {
    AuthorizationBindings,
    GetUserPermissionsFn,
    authorize
} from "loopback-authorization-extension";
import { inject } from "@loopback/context";

export class UserControllerController {
    constructor(
        @inject(AuthorizationBindings.USER_REPOSITORY)
        public userRepository: UserRepository
    ) {}

    @get("/users", {
        responses: {
            "200": {
                ...
            }
        }
    })
    async find(
        @param.query.object("filter", getFilterSchemaFor(User))
        filter?: Filter<User>
    ): Promise<User[]> {
        return this.userRepository.find(filter);
    }
}
```

---

## Many-To-Many relations

Users, Groups, Roles, Permissions has many-to-many relations, using `UserGroupModelRepository`, `UserRoleModelRepository`, `GroupRoleModelRepository`, `RolePermissionModelRepository` you can add some users to groups or roles or add groups to role or assign permissions to roles

**Example**:

```js
import {
    AuthorizationBindings,
    GetUserPermissionsFn,
    authorize
} from "loopback-authorization-extension";
import { inject } from "@loopback/context";

export class UserControllerController {
    constructor(
        @inject(AuthorizationBindings.USER_GROUP_REPOSITORY)
        public userGroupRepository: UserGroupRepository
    ) {}

    @post("/users/...", {
        responses: {
            "200": {
                ...
            }
        }
    })
    async find(...args): Promise<any> {
        // add user to group
        return this.userGroupRepository.create(new UserGroupModel({
            id: "...",
            user: "user id",
            group: "group id"
        }));
    }
}
```

---

## Complete Example

See [this example](https://github.com/koliberr136a1/loopback-authorization-example)

## Contributions

-   [KoLiBer](https://www.linkedin.com/in/mohammad-hosein-nemati-665b1813b/)

## License

This project is licensed under the [MIT license](LICENSE).  
Copyright (c) KoLiBer (koliberr136a1@gmail.com)
