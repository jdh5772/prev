const getIndex = require('../controllers/indexController.js');
const express = require('express');
const router = express.Router();

router.get('/',getIndex);

module.exports = router;