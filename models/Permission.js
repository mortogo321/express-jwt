const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - role_id
 *         - permission
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated permission ID
 *         role_id:
 *           type: integer
 *           description: Foreign key to roles table
 *         permission:
 *           type: string
 *           description: Permission identifier
 *         resource:
 *           type: string
 *           description: Resource this permission applies to
 *         actions:
 *           type: object
 *           description: Actions allowed (view, create, edit, delete, etc)
 *           properties:
 *             view:
 *               type: boolean
 *             create:
 *               type: boolean
 *             edit:
 *               type: boolean
 *             delete:
 *               type: boolean
 */

class Permission extends Model {
  static get tableName() {
    return 'permissions';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['role_id'],

      properties: {
        id: { type: 'integer' },
        role_id: { type: 'integer' },
        permission: { type: 'string', maxLength: 255 },
        resource: { type: ['string', 'null'], maxLength: 255 },
        actions: { type: ['object', 'null'] }
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
          from: 'permissions.role_id',
          to: 'roles.id'
        }
      }
    };
  }
}

module.exports = Permission;
