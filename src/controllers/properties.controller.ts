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
import {Properties} from '../models';
import {PropertiesRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
@authenticate('jwt')
export class PropertiesController {
  constructor(
    @repository(PropertiesRepository)
    public propertiesRepository : PropertiesRepository,
  ) {}

  @post('/properties')
  @response(200, {
    description: 'Properties model instance',
    content: {'application/json': {schema: getModelSchemaRef(Properties)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Properties, {
            title: 'NewProperties',
            exclude: ['id'],
          }),
        },
      },
    })
    properties: Omit<Properties, 'id'>,
  ): Promise<Properties> {
    return this.propertiesRepository.create(properties);
  }

  @get('/properties/count')
  @response(200, {
    description: 'Properties model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Properties) where?: Where<Properties>,
  ): Promise<Count> {
    return this.propertiesRepository.count(where);
  }
  
  @authenticate.skip()
  @get('/properties')
  @response(200, {
    description: 'Array of Properties model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Properties, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Properties) filter?: Filter<Properties>,
  ): Promise<Properties[]> {
    return this.propertiesRepository.find(filter);
  }

  @patch('/properties')
  @response(200, {
    description: 'Properties PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Properties, {partial: true}),
        },
      },
    })
    properties: Properties,
    @param.where(Properties) where?: Where<Properties>,
  ): Promise<Count> {
    return this.propertiesRepository.updateAll(properties, where);
  }

  @get('/properties/{id}')
  @response(200, {
    description: 'Properties model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Properties, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Properties, {exclude: 'where'}) filter?: FilterExcludingWhere<Properties>
  ): Promise<Properties> {
    return this.propertiesRepository.findById(id, filter);
  }

  @get('/properties/property-owner/{userId}/{tenantId}')
  @response(200, {
    description: 'Properties model instance by propertyOwnerId',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Properties, {includeRelations: true}),
      },
    },
  })
  async findByUserId(
    @param.path.string('userId') userId: string,
    @param.path.string('tenantId') tenantId: string,
    @param.filter(Properties, {exclude: 'where'}) filter?: FilterExcludingWhere<Properties>
  ): Promise<Properties[]> {
    return this.propertiesRepository.find({where:{propertyOwnerId: userId, propertyTenantId: tenantId}});
  }

  @get('/properties/property-tenant/{tenantId}')
  @response(200, {
    description: 'Properties model instance by propertyTenantId',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Properties, {includeRelations: true}),
      },
    },
  })
  async findByTenantId(
    @param.path.string('tenantId') tenantId: string,
    @param.filter(Properties, {exclude: 'where'}) filter?: FilterExcludingWhere<Properties>
  ): Promise<Properties[]> {
    return this.propertiesRepository.find({where:{propertyTenantId: tenantId}});
  }


  @patch('/properties/{id}')
  @response(204, {
    description: 'Properties PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Properties, {partial: true}),
        },
      },
    })
    properties: Properties,
  ): Promise<void> {
    await this.propertiesRepository.updateById(id, properties);
  }

  @put('/properties/{id}')
  @response(204, {
    description: 'Properties PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() properties: Properties,
  ): Promise<void> {
    await this.propertiesRepository.replaceById(id, properties);
  }

  @del('/properties/{id}')
  @response(204, {
    description: 'Properties DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.propertiesRepository.deleteById(id);
  }
}
