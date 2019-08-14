const express = require('express');
const { check, validationResult } = require('express-validator');

const Permission = require('../../../models/Permission');

const router = express.Router();

/**
 * @route GET /admin/permissions
 * @group Administrator
 * @returns {Array.<PermissionResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/', async (req, res, next) => {
  try {
    await Permission
      .query()
      .then(permissions => res.json(permissions));
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /admin/permissions
 * @group Administrator
 * @param {Permission.model} permission.body.required
 * @returns {PermissionResponse.model} 200 - Create successfully
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/', [
  check('store').not().isEmpty(),
  check('member').not().isEmpty(),
  check('package').not().isEmpty(),
  check('billing').not().isEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() });
  }

  try {
    await Permission
      .query()
      .insert(req.body)
      .then(permission => res.json(permission));
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
 * @route GET /admin/permissions/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @returns {PermissionResponse.model} 200
 * @returns {any} 204 - No Content
 * @returns {any} 401 - Unauthorized
 * @security JWT
 */
router.get('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);

  try {
    const permission = await Permission
      .query()
      .findById(id);

    if (permission) {
      res.json(permission);
    } else {
      res.status(204).send(); // 204: No content
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /admin/permissions/{id}
 * @group Administrator
 * @param {integer} id.path.required
 * @param {PermissionPut.model} permission.body.required
 * @returns {PermissionResponse.model} 200 - Update successfully
 * @returns {any} 204 - No content
 * @returns {any} 401 - Unauthorized
 * @returns {object} 422 - Validation error
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.put('/:id', [
  check('store').not().isEmpty(),
  check('member').not().isEmpty(),
  check('package').not().isEmpty(),
  check('billing').not().isEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array() });
  }

  let id = parseInt(req.params.id);

  try {
    const permission = await Permission
      .query()
      .patchAndFetchById(id, req.body);

    if (permission) {
      res.json(permission);
    } else {
      res.status(204).send(); // No content
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /admin/permissions/{id}
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
    const deleted = await Permission
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
