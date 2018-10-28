const router = require('express').Router();

const controller = require('./home.controller');
const middleware = require('./home.middleware');

const roomRouter = require('../room/room.router');

router.post('/', controller.create);
router.put('/:id', controller.update);

router.delete('/:id', controller.delete);

router.use('/:homeId/room', middleware.validateHomeId, roomRouter);

module.exports = router;