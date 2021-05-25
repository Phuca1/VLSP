const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');

const adminAuth = async (req, res, next) => {
  const user = req.user;
  if (user.role !== 'admin') {
    throw new CustomError(codes.FORBIDDEN, 'This route is private');
  }
  return next();
};

module.exports = {
  adminAuth,
};
