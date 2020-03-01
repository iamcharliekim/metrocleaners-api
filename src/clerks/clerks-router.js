const express = require('express');
const clerksRouter = express.Router();
const jsonBodyParser = express.json();
const ClerksService = require('./clerks-service');
const { requireAuth } = require('../middleware/basic-auth');

// GET: /clerks
clerksRouter.get('/', requireAuth, function(req, res, next) {
  ClerksService.getClerks(req.app.get('db'))
    .then(clerks => {
      res.json(clerks);
    })
    .catch(next);
});

module.exports = clerksRouter;
