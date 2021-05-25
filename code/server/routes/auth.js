const router = require('express').Router();
const asyncWrapper = require('../middlewares/asyncWrapper');
const authControllers = require('../controllers/auth');
const { auth } = require('../middlewares/checkAuth');
// const {} = require('../validations/')

router.post('/auths/signup', asyncWrapper(authControllers.signup));
router.post('/auths/login', asyncWrapper(authControllers.login));

router.get('/auths/verify', auth, authControllers.verifyAccessToken);
router.patch(
  '/auths/change-password',
  auth,
  asyncWrapper(authControllers.changePassword),
);

module.exports = router;
