const express = require('express');
const clerksRouter = express.Router();
const jsonBodyParser = express.json();
const ClerksService = require('./clerks-service');
const { requireAuth } = require('../middleware/basic-auth');

// GET: /customers
clerksRouter.get('/', requireAuth, function(req, res, next) {
  ClerksService.getClerks(req.app.get('db'))
    .then(clerks => {
      res.json(clerks);
    })
    .catch(next);
});

// POST: /customers
clerksRouter.post('/', jsonBodyParser, function(req, res, next) {});

module.exports = clerksRouter;
