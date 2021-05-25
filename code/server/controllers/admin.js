const userService = require('../services/user');

const getAllUserExceptAdmin = async (req, res, next) => {
  const { allUsers } = await userService.getAllUserExceptAdmin();
  res.json({
    status: 1,
    allUsers,
  });
};

const lockUser = async (req, res, next) => {
  const { message } = await userService.lockUser(req.body.userId);
  res.json({
    status: 1,
    message,
  });
};

const unlockUser = async (req, res, next) => {
  const { message } = await userService.unlockUser(req.body.userId);
  res.json({
    status: 1,
    message,
  });
};

const createUser = async (req, res, next) => {
  const { message, user } = await userService.createUser(req.body);
  res.json({
    status: 1,
    message,
    user,
  });
};

module.exports = {
  getAllUserExceptAdmin,
  lockUser,
  unlockUser,
  createUser,
};
