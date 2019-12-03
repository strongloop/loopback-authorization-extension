# loopback-authorization-extension

Access controlling is one of the most important parts of every application, there are many kinds of models for access controlling like `MAC (Mandatory Access Control)`, `DAC (Discretionary Access Control)`, `RBAC (Role Based Access Control)` and etc (for more information about access models see [this link](https://searchsecurity.techtarget.com/definition/access-control))

`loopback-authorization-extension` is a powerful and generic implementation of `HRBAC (Hierarchical Role Based Access Control)` access model

## Installation

```bash
npm i --save loopback-authorization-extension
```

## Usage

Follow these steps to add `authorization` extension to your loopback4 application

1. **Optional**: Define `User`, `Group`, `Role`, `Permission` models
2. **Optional**: Define `User`, `Group`, `Role`, `Permission` repositories
3. **Optional**: Define `Permissions` class
4. Define your `dataSource`
5. Extend your application from `AuthorizationApplication`
6. Add `AuthorizationActionProvider` to your custom http sequence handler
7. Use `GetUserPermissionsProvider` to find user permissions when `signin` and `save` the permissions in user's session

Now, let's try these

### Step 1 (Define Models)

Use the command `lb4 model` for simplifing your `Entity` model creation, then just replace `Entity` class with `User`, `Group`, `Role` or `Permission` as the parent class

See this example:

```ts
import { model, property } from "@loopback/repository";
import {
    User as UserModel,
    UserRelations as UserModelRelations
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

### Step 2 (Define Repositories)

Use the command `lb4 repository` for simplifing your `Repository` creation, then replace `DefaultCrudRepository` class with `UserRepository`, `GroupRepository`, `RoleRepository` or `PermissionRepository` as the parent class, then bind them

See this example:

```ts
import { Group, GroupRelations } from "../models";
import { MySqlDataSource } from "../datasources";
import { inject } from "@loopback/core";

import {
    GroupRepository as GroupModelRepository,
    F
} from "loopback-authorization-extension";

@bindAuthorization("GroupRepository")
export class GroupRepository extends GroupModelRepository<
    Group,
    GroupRelations
> {
    constructor(@inject("datasources.MySQL") dataSource: MySqlDataSource) {
        super(Group, dataSource);
    }
}
```

> Don't forget bind your repository using `bindAuthorization`

---

### Step 3 (Define Permissions)

Create a class contaning your permissions

See this example:

```ts
import { PermissionsList } from "loopback-authorization-extension";

export class MyPermissions extends PermissionsList {
    /** Files */
    FILES_READ = "Read files";
    FILES_WRITE = "Write files";

    /** Groups */
    GROUPS_READ = "Read groups";
    GROUPS_WRITE = "Write groups";

    /** Roles */
    ROLES_READ = "Read roles";
    ROLES_WRITE = "Write roles";

    /** Users */
    USERS_READ = "Read users";
    USERS_WRITE = "Write users";
}
```

---

### Step 4 (Define DataSource)

Bind your dataSource you want to use for authorization tables using `bindAuthorization`

See this example:

```ts
import { bindAuthorization } from "loopback-authorization-extension";

@bindAuthorization("DataSource")
export class MySqlDataSource extends juggler.DataSource {
    static dataSourceName = "MySQL";

    constructor(
        @inject("datasources.config.MySQL", { optional: true })
        dsConfig: object = config
    ) {
        super(dsConfig);
    }
}
```

---

### Step 5 (Extend Application)

Edit your `application.ts` file, add your permissions class to authorize mixin:

```ts
import {
    AuthorizationApplication,
    AuthorizationApplicationConfig
} from "loopback-authorization-extension";
import { MyPermissions } from "./permissions.ts";

export class TestApplication extends AuthorizationApplication {
    constructor(options: AuthorizationApplicationConfig = {}) {
        super(options);

        // Set up the custom sequence
        this.sequence(MySequence);

        // Set up default home page
        this.static("/", path.join(__dirname, "../public"));

        // ...

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

```ts
import {
    AuthorizationBindings,
    AuthorizeFn
} from "loopback-authorization-extension";
import { MyPermissions } from "../permissions.ts";

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS)
        protected parseParams: ParseParams,
        // add the AuthorizeActionProvider
        @inject(AuthorizationBindings.AUTHORIZE_ACTION)
        protected authorize: AuthorizeFn<MyPermissions>,
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

            // check user permissions
            /*
            * User permissions, will passed to this method,
            * they are loaded, before using `getUserPermissions(id)`
            * action on `sign-in` step of your application,
            * then you must save them in the client's session
            * and at the end, you must pass them to this method
            */
            if (userSession) {
                await this.authorize(userSession.permissions, request, args);
            }

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

```ts
import {
    AuthorizationBindings,
    GetUserPermissionsFn,
    authorize
} from "loopback-authorization-extension";
import { inject } from "@loopback/context";
import { MyPermissions } from "../permissions.ts";

export class SignInController {
    constructor(
        @inject(AuthorizationBindings.GET_USER_PERMISSIONS_ACTION)
        protected getUserPermissions: GetUserPermissionsFn<MyPermissions>
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

        return this.sessionRepository.create(
            new Session({
                //...
                permissions: permissions
            })
        );
    }

    // ...
}
```

---

### Controllers

Now `authorization` extension is fully added and you can protect your endpoints using `@authorize` decorator

You can feel the power of `loopback-authorization-extension` is in this step, by using `And` types, `Or` types, `Async Authorizers`

```ts
// ...
import { MyPermissions } from "../permissions.ts";

@authenticate(...)
@authorize<MyPermissions>({
    and: ["CREATE_USER", "DELETE_USER"]
})
async editUser(...args): Promise<any> {...}

// ...
```

---

## More about `@authorize`

This decorator accepts an object of type `And` or `Or` or `StringPermissionKey` or `AsyncPermissionKey`

your can define any logical combinations of your `Permissions` to control access much better

**Example**:

```ts
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

```ts
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

> You can add or remove users, groups, roles and permissions using your repositories

---

## Many-To-Many relations

Users, Groups, Roles, Permissions has many-to-many relations, using `UserGroupModelRepository`, `UserRoleModelRepository`, `GroupRoleModelRepository`, `RolePermissionModelRepository` you can add some users to groups or roles or add groups to role or assign permissions to roles

**Example**:

```ts
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
