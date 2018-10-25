const router = require('express').Router();

const constroller = require('./room.controller');

router.put('/', controller.save);
router.put('/:id', constroller.update);

router.delete('/', controller.delete);

module.exports = router;