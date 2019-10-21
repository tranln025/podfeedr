const express = require('express');
const router = express.Router();
const ctlr = require('../controllers');

// root dir /search
router.get('/', ctlr.search.show);