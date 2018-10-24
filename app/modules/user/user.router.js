const router = require('express').Router();

const { passport, authparams } = require('../../middleware/auth/auth.middleware');

const controller = require('./user.controller');

router.post('/signup', passport.secret, controller.signup);
router.post('/signin', passport.authenticate('local', authparams), passport.secret, controller.signin);

router.put('/', passport.authenticate('jwt-user', authparams), [ controller.updateData, controller.updatePassword ]);

router.delete('/', passport.authenticate('jwt-uid', authparams), controller.delete);

module.exports = router;