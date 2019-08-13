import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './my-sql.datasource.json';

export class MySqlDataSource extends juggler.DataSource {
  static dataSourceName = 'MySQL';

  constructor(
    @inject('datasources.config.MySQL', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
