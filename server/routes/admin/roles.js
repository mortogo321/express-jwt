const express = require('express');
const { check, validationResult } = require('express-validator');

const Role = require('../../../models/Role');

const router = express.Router();

/**
 * @route GET /admin/roles
 * @group Administrator
 * @returns {Array.<RoleResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/', async (req, res, next) => {
  try {
    await Role
      .query()
      .eager('[permissions]')
      .omit(['role_id'])
      .then(roles => res.json(roles));
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /admin/roles
 * @group Administrator
 * @param {Role.model} role.body.required
 * @returns {RoleResponse.model} 200 - Create successfully
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/', [
  check('role').isLength({ min: 4 })
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() });
  }

  try {
    await Role
      .query()
      .insert(req.body)
      .then(role => res.json(role));
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
 * @route GET /admin/roles/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @returns {RoleResponse.model} 200
 * @returns {any} 204 - No Content
 * @returns {any} 401 - Unauthorized
 * @security JWT
 */
router.get('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);

  try {
    const role = await Role
      .query()
      .eager('[permissions]')
      .omit(['role_id'])
      .findById(id);

    if (role) {
      res.json(role);
    } else {
      res.status(204).send(); // 204: No content
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /admin/roles/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @param {Role.model} role.body.required
 * @returns {RoleResponse.model} 200 - Update successfully
 * @returns {any} 204 - No content
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.put('/:id', [
  check('role').isLength({ min: 4 })
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() });
  }

  let id = parseInt(req.params.id);

  try {
    const role = await Role
      .query()
      .patchAndFetchById(id, req.body);

    if (role) {
      res.json(role);
    } else {
      res.status(204).send(); // No content
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /admin/roles/{id}
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
    const deleted = await Role
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
