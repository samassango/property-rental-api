import {Entity, model, property} from '@loopback/repository';

@model()
export class RentalPrice extends Entity {
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
  propertyId: string;

  @property({
    type: 'string',
    required: true,
  })
  propertyPrice: string;

  @property({
    type: 'boolean',
    required: true,
  })
  paidStatus: boolean;

  @property({
    type: 'date',
    required: true,
    defaultFn:'now'
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
    defaultFn:'now'
  })
  updatedAt: string;


  constructor(data?: Partial<RentalPrice>) {
    super(data);
  }
}

export interface RentalPriceRelations {
  // describe navigational properties here
}

export type RentalPriceWithRelations = RentalPrice & RentalPriceRelations;
