const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef User
* @property {string} username.required - Min length 4 characters
* @property {string} password.required - Min length 6 characters
* @property {string} confirm_password.required
* @property {string} email.required - email address
* @property {integer} role_id.required - role id - eg: 2
*/

/**
* @typedef UserResponse
* @property {integer} id
* @property {string} username
* @property {string} email
* @property {RoleResponse.model} role
*/

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    const Role = require('./Role');

    return {
      role: {
        relation: Model.HasOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'roles.id'
        }
      }
    }
  }
}

module.exports = User;
