const router = require('express').Router();
const cors = require('cors');

const userRouter = require('../app/modules/user/user.router');
const homeRouter = require('../app/modules/home/home.router');

const { passport, authparams } = require('../app/middleware/auth/auth.middleware');

const { client } = require('../config');

router.all('/*', cors(client));

router.use('/user', userRouter);
router.use('/home', passport.authenticate('jwt-uid', authparams), homeRouter);

module.exports = router;