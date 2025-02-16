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
import {PaymentTracker} from '../models';
import {PaymentTrackerRepository} from '../repositories';

export class PaymentTrackerController {
  constructor(
    @repository(PaymentTrackerRepository)
    public paymentTrackerRepository : PaymentTrackerRepository,
  ) {}

  @post('/payment-trackers')
  @response(200, {
    description: 'PaymentTracker model instance',
    content: {'application/json': {schema: getModelSchemaRef(PaymentTracker)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentTracker, {
            title: 'NewPaymentTracker',
            exclude: ['id'],
          }),
        },
      },
    })
    paymentTracker: Omit<PaymentTracker, 'id'>,
  ): Promise<PaymentTracker> {
    return this.paymentTrackerRepository.create(paymentTracker);
  }

  @get('/payment-trackers/count')
  @response(200, {
    description: 'PaymentTracker model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PaymentTracker) where?: Where<PaymentTracker>,
  ): Promise<Count> {
    return this.paymentTrackerRepository.count(where);
  }

  @get('/payment-trackers')
  @response(200, {
    description: 'Array of PaymentTracker model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PaymentTracker, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PaymentTracker) filter?: Filter<PaymentTracker>,
  ): Promise<PaymentTracker[]> {
    return this.paymentTrackerRepository.find(filter);
  }

  @patch('/payment-trackers')
  @response(200, {
    description: 'PaymentTracker PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentTracker, {partial: true}),
        },
      },
    })
    paymentTracker: PaymentTracker,
    @param.where(PaymentTracker) where?: Where<PaymentTracker>,
  ): Promise<Count> {
    return this.paymentTrackerRepository.updateAll(paymentTracker, where);
  }

  @get('/payment-trackers/{id}')
  @response(200, {
    description: 'PaymentTracker model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PaymentTracker, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PaymentTracker, {exclude: 'where'}) filter?: FilterExcludingWhere<PaymentTracker>
  ): Promise<PaymentTracker> {
    return this.paymentTrackerRepository.findById(id, filter);
  }

  @patch('/payment-trackers/{id}')
  @response(204, {
    description: 'PaymentTracker PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PaymentTracker, {partial: true}),
        },
      },
    })
    paymentTracker: PaymentTracker,
  ): Promise<void> {
    await this.paymentTrackerRepository.updateById(id, paymentTracker);
  }

  @put('/payment-trackers/{id}')
  @response(204, {
    description: 'PaymentTracker PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() paymentTracker: PaymentTracker,
  ): Promise<void> {
    await this.paymentTrackerRepository.replaceById(id, paymentTracker);
  }

  @del('/payment-trackers/{id}')
  @response(204, {
    description: 'PaymentTracker DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.paymentTrackerRepository.deleteById(id);
  }
}
