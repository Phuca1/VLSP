const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');

const managerAuth = async (req, res, next) => {
  const user = req.user;
  if (user.role !== 'manager') {
    throw new CustomError(codes.FORBIDDEN, 'This route is private');
  }
  return next();
};

module.exports = {
  managerAuth,
};
