const express = require('express');

const permissionsRouter = require('./permissions');
const rolesRouter = require('./roles');
const usersRouter = require('./users');

const router = express.Router();

router.use('/permissions', permissionsRouter);
router.use('/roles', rolesRouter);
router.use('/users', usersRouter);

module.exports = router;
