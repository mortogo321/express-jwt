require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');

require('../../models/Auth');
const User = require('../../models/User');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 4
 *                 example: admin
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Password@01
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: object
 *                 token:
 *                   type: string
 *                 expire_in:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post('/login', [
  body('username')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, password } = req.body;

    // Fetch user with role and permissions
    const user = await User
      .query()
      .withGraphFetched('[role.[permissions]]')
      .where('username', username)
      .first();

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const expiresIn = 60 * 60 * 24; // 24 hours
    const token = sign(
      {
        username: user.username,
        userId: user.id,
        roleId: user.role_id
      },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      user: userResponse,
      token,
      expire_in: expiresIn
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', async (req, res, next) => {
  try {
    // This would require additional implementation to handle refresh tokens
    // For now, return a not implemented response
    res.status(501).json({
      error: 'Not implemented',
      message: 'Token refresh endpoint requires refresh token implementation'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
