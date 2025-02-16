import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RentalDbDataSource} from '../datasources';
import {Properties, PropertiesRelations} from '../models';

export class PropertiesRepository extends DefaultCrudRepository<
  Properties,
  typeof Properties.prototype.id,
  PropertiesRelations
> {
  constructor(
    @inject('datasources.rentalDb') dataSource: RentalDbDataSource,
  ) {
    super(Properties, dataSource);
  }
}
