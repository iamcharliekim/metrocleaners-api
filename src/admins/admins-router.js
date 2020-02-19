const express = require('express');
const AdminsService = require('./admins-service');
const adminsRouter = express.Router();
const jsonBodyParser = express.json();

// GET: /admins
adminsRouter.get('/', function(req, res, next) {
  AdminsService.getAdmins(req.app.get('db'))
    .then(admins => {
      res.json(admins);
    })
    .catch(next);
});

// POST: /admins
adminsRouter.post('/', jsonBodyParser, function(req, res, next) {
  const full_name = req.body.full_name;
  const user_name = req.body.user_name;
  const password = req.body.password;

  // CHECK IF USERNAME IS UNIQUE
  AdminsService.userNameIsUnique(req.app.get('db'), user_name).then(userNameIsUnique => {
    if (!userNameIsUnique) {
      res.status(400).json({ error: 'Username already taken' });
    }

    //validate password
    if (userNameIsUnique) {
      return AdminsService.hashPassword(password).then(hashedPW => {
        const updatedAdmin = {
          full_name,
          user_name,
          password: hashedPW
        };

        return AdminsService.insertAdmin(req.app.get('db'), updatedAdmin)
          .then(admin => {
            res.status(201).json(admin);
          })
          .catch(next);
      });
    }
  });
});

module.exports = adminsRouter;
