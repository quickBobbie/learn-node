const router = require('express').Router();

const controller = require('./home.controller');

router.get('/', controller.get);

router.put('/', [ controller.create, controller.update ]);

module.exports = router;