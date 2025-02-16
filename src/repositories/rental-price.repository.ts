import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RentalDbDataSource} from '../datasources';
import {RentalPrice, RentalPriceRelations} from '../models';

export class RentalPriceRepository extends DefaultCrudRepository<
  RentalPrice,
  typeof RentalPrice.prototype.id,
  RentalPriceRelations
> {
  constructor(
    @inject('datasources.rentalDb') dataSource: RentalDbDataSource,
  ) {
    super(RentalPrice, dataSource);
  }
}
