const tabaleName = 'users';

exports.up = knex => {
  return knex.schema.createTable(tabaleName, table => {
    table.increments('id');
    table.integer('role_id').unsigned();
    table.string('username');
    table.string('password');
    table.string('email');

    table.unique('username');
    table.unique('email');
    table.foreign('role_id').references('roles.id');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(tabaleName);
};
