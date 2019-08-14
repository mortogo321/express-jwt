const tabaleName = 'roles';

exports.seed = knex => {
  return knex(tabaleName).del()
    .then(() => {
      return knex(tabaleName).insert([
        {
          role: 'admin',
          description: 'Administrator role'
        },
        {
          role: 'user',
          description: 'User role'
        }
      ]);
    });
};
