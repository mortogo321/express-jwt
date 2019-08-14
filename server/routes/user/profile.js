const express = require('express');
const router = express.Router();

/**
 * @route GET /user/profile
 * @group User
 * @returns {Array.<UserResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/', (req, res, next) => {
  res.json({info: 'user profile'});
});

module.exports = router;
