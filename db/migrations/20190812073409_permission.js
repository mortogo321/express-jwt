const tableName = 'permissions';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.integer('role_id').unsigned().notNullable();
    table.string('permission', 255).notNullable();
    table.string('resource', 255).nullable();
    table.json('actions').nullable();
    table.timestamps(true, true);

    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.index('role_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists(tableName);
};
