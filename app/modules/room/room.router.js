const router = require('express').Router();

const controller = require('./room.controller');

router.post('/', controller.create);
router.put('/:roomId', controller.update);

router.delete('/:roomId', controller.delete);

module.exports = router;