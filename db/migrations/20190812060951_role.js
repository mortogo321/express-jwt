const tableName = 'roles';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.string('role', 255).notNullable().unique();
    table.text('description').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists(tableName);
};
