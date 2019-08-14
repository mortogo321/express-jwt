const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef Role
* @property {string} role.required - Unique, Min length 4 characters
* @property {string} description
*/

/**
* @typedef RoleResponse
* @property {integer} id
* @property {string} role
* @property {string} description
* @property {PermissionResponse.model} permissions
*/

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get relationMappings() {
    const Permission = require('./Permission');

    return {
      permissions: {
        relation: Model.HasOneRelation,
        modelClass: Permission,
        join: {
          from: 'roles.id',
          to: 'permissions.role_id'
        }
      }
    }
  }
}

module.exports = Role;
