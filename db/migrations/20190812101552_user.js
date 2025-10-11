const tableName = 'users';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.integer('role_id').unsigned().notNullable();
    table.string('username', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.timestamps(true, true);

    table.foreign('role_id').references('id').inTable('roles').onDelete('RESTRICT');
    table.index('role_id');
    table.index('email');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.dropTableIfExists(tableName);
};
