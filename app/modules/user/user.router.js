const router = require('express').Router();

const { passport, authparams } = require('../../middleware/auth/auth.middleware');

const controller = require('./user.controller');

router.post('/signup', passport.secret, controller.signup);
router.post('/signin', passport.authenticate('local', authparams), passport.secret, controller.signin);

router.put('/data', passport.authenticate('jwt-user', authparams), controller.updateData);
router.put('/password', passport.authenticate('jwt-user', authparams), controller.updatePassword);

router.delete('/', passport.authenticate('jwt-uid', authparams), controller.delete);

module.exports = router;