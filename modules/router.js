const router = require('express').Router();

const userRouter = require('../app/modules/user/user.router');
const homeRouter = require('../app/modules/home/home.router');

const { passport, authparams } = require('../app/middleware/auth/auth.middleware');

router.use('/user', userRouter);
router.use('/home', passport.authenticate('jwt-uid', authparams), homeRouter);

module.exports = router;