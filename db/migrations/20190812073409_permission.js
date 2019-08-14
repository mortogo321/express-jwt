const tabaleName = 'permissions';

exports.up = knex => {
  return knex.schema.createTable(tabaleName, table => {
    table.increments('id');
    table.integer('role_id').unsigned();
    table.json('store').defaultTo('{}');
    table.json('member').defaultTo('{}');
    table.json('package').defaultTo('{}');
    table.json('billing').defaultTo('{}');

    table.unique('role_id');
  });
};

exports.down = knex => {
  return knex.schema.dropTable(tabaleName);
};
