import {Entity, model, property} from '@loopback/repository';

@model()
export class PaymentTracker extends Entity {
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
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  paymentAmountPaid: string;

  @property({
    type: 'date',
    required: true,
    defaultFn:'now'
  })
  paymentDate: string;

  @property({
    type: 'string',
    required: true,
  })
  propertyId: string;

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


  constructor(data?: Partial<PaymentTracker>) {
    super(data);
  }
}

export interface PaymentTrackerRelations {
  // describe navigational properties here
}

export type PaymentTrackerWithRelations = PaymentTracker & PaymentTrackerRelations;
