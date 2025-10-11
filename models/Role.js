const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated role ID
 *         role:
 *           type: string
 *           minLength: 4
 *           description: Unique role name (min 4 characters)
 *         description:
 *           type: string
 *           description: Role description
 */

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role'],

      properties: {
        id: { type: 'integer' },
        role: { type: 'string', minLength: 4, maxLength: 255 },
        description: { type: ['string', 'null'], maxLength: 500 }
      }
    };
  }

  static get relationMappings() {
    const Permission = require('./Permission');
    const User = require('./User');

    return {
      permissions: {
        relation: Model.HasManyRelation,
        modelClass: Permission,
        join: {
          from: 'roles.id',
          to: 'permissions.role_id'
        }
      },
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          to: 'users.role_id'
        }
      }
    };
  }
}

module.exports = Role;
