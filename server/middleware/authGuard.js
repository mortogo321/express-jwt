require('dotenv').config();

const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

const Role = require('../../models/Role');
const User = require('../../models/User');

const passportOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
  jsonWebTokenOptions: {
    ignoreExpiration: false
  }
};

const jwtStrategy = new Strategy(passportOptions, async (req, payload, done) => {
  try {
    // Get role from request context
    const requestedRole = req.params.role;

    if (!requestedRole) {
      return done(new Error('Role not specified'), false);
    }

    // Fetch role from database
    const role = await Role
      .query()
      .where('role', requestedRole)
      .first();

    if (!role) {
      return done(new Error('Role not found'), false);
    }

    // Fetch user with eager loading of role and permissions
    const user = await User
      .query()
      .select('id', 'username', 'email', 'role_id')
      .withGraphFetched('[role.[permissions]]')
      .where('username', payload.username)
      .first();

    if (!user) {
      return done(new Error('User not found'), false);
    }

    // Verify user has the required role
    if (user.role_id !== role.id) {
      return done(new Error('Insufficient permissions'), false);
    }

    // Success - attach user to request
    return done(null, user);
  } catch (error) {
    console.error('JWT Strategy Error:', error);
    return done(error, false);
  }
});

passport.use(jwtStrategy);

const authGuard = {
  jwt(role) {
    return (req, res, next) => {
      req.params.role = role;

      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
          return res.status(401).json({
            error: 'Authentication failed',
            message: err.message
          });
        }

        if (!user) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: info?.message || 'Invalid token'
          });
        }

        // Attach authenticated user to request
        req.user = user;
        next();
      })(req, res, next);
    };
  },

  // Optional: Middleware to check specific permissions
  hasPermission(permissionName) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      const hasPermission = req.user.role?.permissions?.some(
        permission => permission.permission === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Insufficient permissions'
        });
      }

      next();
    };
  }
};

module.exports = authGuard;
