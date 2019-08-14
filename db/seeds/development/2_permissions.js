const tabaleName = 'permissions';

exports.seed = knex => {
  return knex(tabaleName).del()
    .then(() => {
      return knex(tabaleName).insert([
        {
          role_id: 1,
          store: JSON.stringify({
            view: true,
            create: true,
            edit: true,
            delete: true,
            ban: true,
            suspended: true
          }),
          member: JSON.stringify({
            view: true,
            create: true,
            edit: true,
            delete: true,
            ban: true,
            suspended: true
          }),
          package: JSON.stringify({
            view: true,
            create: true,
            edit: true,
            delete: true
          }),
          billing: JSON.stringify({
            view: true,
            create: true,
            edit: true,
            delete: true
          })
        },
        {
          role_id: 2,
          store: JSON.stringify({
            view: true,
            create: false,
            edit: false,
            delete: false,
            ban: false,
            suspended: false
          }),
          member: JSON.stringify({
            view: true,
            create: false,
            edit: false,
            delete: false,
            ban: false,
            suspended: false
          }),
          package: JSON.stringify({
            view: true,
            create: false,
            edit: false,
            delete: false
          }),
          billing: JSON.stringify({
            view: true,
            create: false,
            edit: false,
            delete: false
          })
        }
      ]);
    });
};
