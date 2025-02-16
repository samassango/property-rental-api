import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RentalDbDataSource} from '../datasources';
import {Users, UsersRelations} from '../models';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  constructor(
    @inject('datasources.rentalDb') dataSource: RentalDbDataSource,
  ) {
    super(Users, dataSource);
  }
}
