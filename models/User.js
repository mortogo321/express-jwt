const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *         - role_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *         username:
 *           type: string
 *           minLength: 4
 *           description: Username (min 4 characters)
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Hashed password (min 6 characters)
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         role_id:
 *           type: integer
 *           description: Foreign key to roles table
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/Role'
 */

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['username', 'password', 'email', 'role_id'],

      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 4, maxLength: 255 },
        password: { type: 'string', minLength: 6 },
        email: { type: 'string', format: 'email', maxLength: 255 },
        role_id: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    const Role = require('./Role');

    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'roles.id'
        }
      }
    };
  }

  // Hide password in JSON serialization
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  // Virtual properties
  static get virtualAttributes() {
    return ['fullPermissions'];
  }

  get fullPermissions() {
    return this.role?.permissions || [];
  }
}

module.exports = User;
