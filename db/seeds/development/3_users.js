const bcrypt = require('bcrypt');

const tabaleName = 'users';

exports.seed = knex => {
  return knex(tabaleName).del()
    .then(async () => {
      let hashPassword = '';

      await bcrypt.hash('Password@01', 10)
        .then(hash => hashPassword = hash);

      return knex(tabaleName).insert([
        {
          username: 'admin',
          password: hashPassword,
          email: 'admin@example.com',
          role_id: 1
        },
        {
          username: 'demo',
          password: hashPassword,
          email: 'demo@example.com',
          role_id: 2
        }
      ]);
    });
};
