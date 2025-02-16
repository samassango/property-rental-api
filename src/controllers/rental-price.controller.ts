import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {RentalPrice} from '../models';
import {RentalPriceRepository} from '../repositories';

export class RentalPriceController {
  constructor(
    @repository(RentalPriceRepository)
    public rentalPriceRepository : RentalPriceRepository,
  ) {}

  @post('/rental-prices')
  @response(200, {
    description: 'RentalPrice model instance',
    content: {'application/json': {schema: getModelSchemaRef(RentalPrice)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RentalPrice, {
            title: 'NewRentalPrice',
            exclude: ['id'],
          }),
        },
      },
    })
    rentalPrice: Omit<RentalPrice, 'id'>,
  ): Promise<RentalPrice> {
    return this.rentalPriceRepository.create(rentalPrice);
  }

  @get('/rental-prices/count')
  @response(200, {
    description: 'RentalPrice model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RentalPrice) where?: Where<RentalPrice>,
  ): Promise<Count> {
    return this.rentalPriceRepository.count(where);
  }

  @get('/rental-prices')
  @response(200, {
    description: 'Array of RentalPrice model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RentalPrice, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RentalPrice) filter?: Filter<RentalPrice>,
  ): Promise<RentalPrice[]> {
    return this.rentalPriceRepository.find(filter);
  }

  @patch('/rental-prices')
  @response(200, {
    description: 'RentalPrice PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RentalPrice, {partial: true}),
        },
      },
    })
    rentalPrice: RentalPrice,
    @param.where(RentalPrice) where?: Where<RentalPrice>,
  ): Promise<Count> {
    return this.rentalPriceRepository.updateAll(rentalPrice, where);
  }

  @get('/rental-prices/{id}')
  @response(200, {
    description: 'RentalPrice model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RentalPrice, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RentalPrice, {exclude: 'where'}) filter?: FilterExcludingWhere<RentalPrice>
  ): Promise<RentalPrice> {
    return this.rentalPriceRepository.findById(id, filter);
  }

  @patch('/rental-prices/{id}')
  @response(204, {
    description: 'RentalPrice PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RentalPrice, {partial: true}),
        },
      },
    })
    rentalPrice: RentalPrice,
  ): Promise<void> {
    await this.rentalPriceRepository.updateById(id, rentalPrice);
  }

  @put('/rental-prices/{id}')
  @response(204, {
    description: 'RentalPrice PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() rentalPrice: RentalPrice,
  ): Promise<void> {
    await this.rentalPriceRepository.replaceById(id, rentalPrice);
  }

  @del('/rental-prices/{id}')
  @response(204, {
    description: 'RentalPrice DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.rentalPriceRepository.deleteById(id);
  }
}
