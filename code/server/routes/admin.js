const router = require('express').Router();
const asyncWrapper = require('../middlewares/asyncWrapper');
const { auth } = require('../middlewares/checkAuth');
const { adminAuth } = require('../middlewares/checkAdmin');
const adminControllers = require('../controllers/admin');

router.get(
  '/admin/all-users',
  auth,
  adminAuth,
  asyncWrapper(adminControllers.getAllUserExceptAdmin),
);

router.patch(
  '/admin/lock-user',
  auth,
  adminAuth,
  asyncWrapper(adminControllers.lockUser),
);

router.patch(
  '/admin/unlock-user',
  auth,
  adminAuth,
  asyncWrapper(adminControllers.unlockUser),
);

router.post(
  '/admin/create-user',
  auth,
  adminAuth,
  asyncWrapper(adminControllers.createUser),
);

module.exports = router;
