const asyncMiddleware = require('./asyncWrapper');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const authService = require('../services/auth');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError(codes.UNAUTHORIZED);
  const [tokenType, accessToken] = authorization.split(' ');
  if (tokenType !== 'Bearer') throw new CustomError(codes.UNAUTHORIZED);
  const user = await authService.verifyAccessToken(accessToken);
  req.user = user;
  // console.log('at auth middleware :', user);
  return next();
};

module.exports = {
  auth: asyncMiddleware(auth),
};
