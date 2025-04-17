// ---------- ADD IMPORTS -------------
import { authenticate, TokenService } from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { inject } from '@loopback/core';
import { Count, CountSchema, model, property, repository, Where } from '@loopback/repository';
import { get, getModelSchemaRef, HttpErrors, param, patch, post, requestBody, response, SchemaObject } from '@loopback/rest';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { genSalt, hash } from 'bcryptjs';
import _ from 'lodash';
// ----------------------------------

@model({
  settings: {
    indexes: {
      uniqueEmail: {
        keys: {
          email: 1,
        },
        options: {
          unique: true,
        },
      },
    },
  },
})
export class NewUserRequest extends User {
  @property({
    type: 'string',
  })
  firstname: string;

  @property({
    type: 'string',
  })
  lastname: string;
  @property({
    type: 'string',
    required: true,
  })
  userType: string;
  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 5,
    },

  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
};

export class UserController {
  constructor(@inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,) { }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return { token };
  }

  @post('/verifyToken')
  async verifyToken(
    @requestBody({
      description: 'The input of verify token function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
          },
        },
      },
    })
    requestData: { token: string },
  ): Promise<UserProfile> {
    try {
      return await this.jwtService.verifyToken(requestData.token);
    } catch (err) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @authenticate('jwt')
  @get('/get-current-user', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async getCurrentUser(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: currentUserProfile.email } })
    return user as User
  }

  @authenticate('jwt')
  @get('/get-current-user/{id}', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, { includeRelations: true }),
          },
        },
      },
    },
  })
  async getuserById(
    @param.path.string('id') id: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } })
    return user as User
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOne({ where: { email: newUserRequest.email } })
      console.log({foundUser})
      if (!foundUser) {
        const password = await hash(newUserRequest.password, await genSalt());
        const savedUser = await this.userRepository.create(
          _.omit(newUserRequest, 'password'),
        );

        await this.userRepository.userCredentials(savedUser.id).create({ password });
        
        return savedUser;
      }else{
         throw new HttpErrors.Forbidden('Account already exist, please login or request reset password')
      }

    } catch (error) {
      console.log({ error })
      throw error
    }

  }

  @authenticate('jwt')
  @post('/users/password-reset', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async passwordReset(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    // const savedUser = await this.userRepository.create(
    //   _.omit(newUserRequest, 'password'),
    // );

    const user = await this.userRepository.findOne({ where: { email: newUserRequest.email } })
    if (!user) {
      throw new HttpErrors.NotFound("User not found")
    }
    // const userProfile = this.userService.convertToUserProfile(user);
    // const token = await  this.jwtService.generateToken(userProfile);

    await this.userRepository.userCredentials(user.id).patch({ password })//.create({ password });

    return user;
  }

  @patch('/users/update')
  @response(200, {
    description: 'User PATCH success count',
    content: {
      'application/json': {
        schema: getModelSchemaRef(NewUserRequest, {
          title: 'NewUser',
        })
      }
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, { partial: true }),
        },
      },
    })
    user: NewUserRequest,
    @param.where(NewUserRequest) where?: Where<NewUserRequest>,
  ): Promise<Count> {

    return this.userRepository.updateAll(user, where);
  }
}
