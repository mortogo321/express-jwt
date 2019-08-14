const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const User = require('../../../models/User');

const router = express.Router();

/**
 * @route GET /admin/users
 * @group Administrator
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/', async (req, res, next) => {
  try {
    await User
      .query()
      .omit(['password'])
      .eager('[role.[permissions]]')
      .then(users => res.json(users));
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /admin/users
 * @group Administrator
 * @param {User.model} user.body.required
 * @returns {UserResponse.model} 200 - Create successfully
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/', [
  check('username').isLength({ min: 4 }),
  check('password')
    .isLength({ min: 6 })
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirm_password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
  check('email').isEmail(),
  check('role_id').isInt()
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() });
  }

  delete req.body.confirm_password;

  await bcrypt.hash(req.body.password, 10)
    .then(hash => req.body.password.password = hash);

  try {
    await User
      .query()
      .insert(req.body)
      .omit(['password'])
      .eager('[role.[permissions]]')
      .then(user => res.json(user));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res
        .status(422)
        .json({ errors: error });
    }

    next(error);
  }
});

/**
 * @route GET /admin/users/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @returns {UserResponse.model} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 204 - No Content
 * @security JWT
 */
router.get('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);

  try {
    const user = await User
      .query()
      .omit(['password'])
      .eager('[role.[permissions]]')
      .findById(id);

    if (user) {
      res.json(user);
    } else {
      res.status(204).send(); // 204: No content
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /admin/users/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @param {User.model} user.body.required
 * @returns {UserResponse.model} 200 - Update successfully
 * @returns {any} 204 - No content
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.put('/:id', [
  check('username').isLength({ min: 4 }),
  check('password')
    .isLength({ min: 6 })
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirm_password) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
  check('email').isEmail(),
  check('role_id').isInt()
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() });
  }

  let id = parseInt(req.params.id);

  delete req.body.confirm_password;

  await bcrypt.hash(req.body.password, 10)
    .then(hash => req.body.password.password = hash);

  try {
    const user = await User
      .query()
      .omit(['password'])
      .eager('[role.[permissions]]')
      .patchAndFetchById(id, req.body);

    if (user) {
      res.json(user);
    } else {
      res.status(204).send(); // No content
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /admin/users/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @returns {object} 200 - Delete successfully
 * @returns {any} 204 - No Content
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.delete('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);

  try {
    const deleted = await User
      .query()
      .deleteById(id);

    if (deleted) {
      res.json({
        message: 'Deleted successfully',
        deleted: deleted
      });
    } else {
      res.status(204).send(); // No content
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
