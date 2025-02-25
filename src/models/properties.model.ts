import {Entity, model, property} from '@loopback/repository';

@model()
export class Properties extends Entity {
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
  propertyName: string;

  @property({
    type: 'string',
    required: true,
  })
  propertyAddress: string;

  @property({
    type: 'string',
    required: true,
  })
  propertyOwnerId: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  propertyUsers?: string[];

  @property({
    type: 'boolean',
    defaultFn: true
  })
  propertyAvailability?: boolean;

  @property({
    type: 'string',
  })
  propertyDescription?: string;

  @property({
    type: 'string',
  })
  propertyPrice?: string;

  @property({
    type: 'string',
  })
  propertyNoOfBadroom?: string;

  @property({
    type: 'string',
  })
  propertyNoOfBathroom?: string;

  @property({
    type: 'string',
  })
  propertyNoOfGarage?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  propertyImages?: string[];

  @property({
    type: 'date',
    defaultFn:'now'
  })
  createdAt?: string;

  @property({
    type: 'date',
    defaultFn:'now'
  })
  updatedAt?: string;


  constructor(data?: Partial<Properties>) {
    super(data);
  }
}

export interface PropertiesRelations {
  // describe navigational properties here
}

export type PropertiesWithRelations = Properties & PropertiesRelations;
