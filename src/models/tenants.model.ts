import {Entity, model, property} from '@loopback/repository';

@model()
export class Tenants extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  tenantOwnerId: string;

  @property({
    type: 'string',
  })
  tenantName?: string;

  @property({
    type: 'string',
    required: true,
  })
  tenantDescription: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  tenantImages?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  userIds: string[];

  @property({
    type: 'string',
  })
  tenantBanner?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  propertyIds?: string[];

  @property({
    type: 'date',
    required: true,
    defaultFn:'now'
  })
  createdAt: string;

  @property({
    type: 'date',
    defaultFn:'now'
  })
  updatedAt?: string;


  constructor(data?: Partial<Tenants>) {
    super(data);
  }
}

export interface TenantsRelations {
  // describe navigational properties here
}

export type TenantsWithRelations = Tenants & TenantsRelations;
