import { bind, inject } from "@loopback/core";
import { juggler } from "@loopback/repository";

@bind(binding => {
    binding.tag({ authorization: true });
    binding.tag({ dataSource: true });

    return binding;
})
export class AuthorizationDataSource extends juggler.DataSource {}

export function injectDataSource() {
    return inject(binding => {
        return binding.tagMap.authorization && binding.tagMap.dataSource;
    });
}
