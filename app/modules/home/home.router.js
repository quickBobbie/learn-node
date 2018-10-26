const router = require('express').Router();

const controller = require('./home.controller');

const roomRouter = require('../room/room.router');

router.put('/', controller.create);
router.put('/:id', controller.update);

router.delete('/:id', controller.delete);

router.use('/:homeId/room', controller.validateHomeId, roomRouter);

module.exports = router;