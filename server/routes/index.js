const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({info: 'Olufy Jeweal - Staff API v1.0.0'});
});

module.exports = router;
