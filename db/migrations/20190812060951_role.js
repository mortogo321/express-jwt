const tabaleName = 'roles';

exports.up = knex => {
  return knex.schema.createTable(tabaleName, table => {
    table.increments('id');
    table.string('role');
    table.text('description').nullable();

    table.unique('role');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(tabaleName);
};
