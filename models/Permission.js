const { Model } = require('objection');
const knex = require('../db');

Model.knex(knex);

/**
* @typedef PermissionSuspend
* @property {boolean} view - - eg: true
* @property {boolean} create - - eg: false
* @property {boolean} edit - - eg: false
* @property {boolean} delete - - eg: false
* @property {boolean} ban - - eg: false
* @property {boolean} suspended - - eg: false
*/

/**
* @typedef PermissionEdit
* @property {boolean} view - - eg: true
* @property {boolean} create - - eg: false
* @property {boolean} edit - - eg: false
* @property {boolean} delete - - eg: false
*/

/**
* @typedef Permission
* @property {integer} role_id.required
* @property {PermissionSuspend.model} store.required - Store permission
* @property {PermissionSuspend.model} member.required - Member permission
* @property {PermissionEdit.model} package.required - Package permission
* @property {PermissionEdit.model} billing.required - Billing permission
*/

/**
* @typedef PermissionPut
* @property {PermissionSuspend.model} store.required - Store permission
* @property {PermissionSuspend.model} member.required - Member permission
* @property {PermissionEdit.model} package.required - Package permission
* @property {PermissionEdit.model} billing.required - Billing permission
*/

/**
* @typedef PermissionResponse
* @property {integer} id
* @property {PermissionSuspend.model} store
* @property {PermissionSuspend.model} member
* @property {PermissionEdit.model} package
* @property {PermissionEdit.model} billing
*/

class Permission extends Model {
  static get tableName() {
    return 'permissions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['store', 'member', 'package', 'billing'],
      properties: {
        store: { type: 'object' },
        member: { type: 'object' },
        package: { type: 'object' },
        billing: { type: 'object' }
      }
    };
  }
}

module.exports = Permission;
