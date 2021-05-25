const authService = require('../services/auth');

const signup = async (req, res, next) => {
  const { name, email, password, job } = req.body;
  console.log(name, email, password, job);
  const info = { name, email, password, job, actived: true, role: 'user' };
  const { user, token } = await authService.signup(info);
  res.json({
    status: 1,
    user,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  res.json({
    status: 1,
    user,
    token,
  });
};

const verifyAccessToken = (req, res, next) => {
  const user = req.user;
  // console.log('at verify controller', user);
  res.json({
    status: 1,
    user,
  });
};

const changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  const userId = req.user.id;
  const user = await authService.changePassword(userId, password, newPassword);
  res.json({
    status: 1,
    message: 'Update password success',
  });
};

module.exports = {
  signup,
  login,
  verifyAccessToken,
  changePassword,
};
