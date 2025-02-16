import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RentalDbDataSource} from '../datasources';
import {PaymentTracker, PaymentTrackerRelations} from '../models';

export class PaymentTrackerRepository extends DefaultCrudRepository<
  PaymentTracker,
  typeof PaymentTracker.prototype.id,
  PaymentTrackerRelations
> {
  constructor(
    @inject('datasources.rentalDb') dataSource: RentalDbDataSource,
  ) {
    super(PaymentTracker, dataSource);
  }
}
