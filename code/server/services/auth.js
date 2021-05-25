const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CustomError = require('../errors/CustomError');

const { SECRETE_KEY } = require('../config');

const userDAO = require('../daos/user');
const codes = require('../errors/code');

const signup = async (info) => {
  const { email, password } = info;
  const existedUser = await userDAO.findOneUser({ email });
  if (existedUser) {
    throw new CustomError(codes.EMAIL_EXISTED, 'Email existed');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userDAO.createUser({
    ...info,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: newUser.id }, SECRETE_KEY);

  return { user: newUser, token };
};

const login = async ({ email, password }) => {
  const existedUser = await userDAO.findOneUser({ email });
  if (!existedUser) {
    throw new CustomError(codes.EMAIL_NOT_EXIST, 'Email is not exist');
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existedUser.password);
  } catch (error) {
    throw new CustomError(codes.UNAUTHORIZED, 'Cannot verify password');
  }

  if (!isValidPassword) {
    throw new CustomError(codes.WRONG_PASSWORD, 'Wrong password');
  }

  if (!existedUser.actived) {
    throw new CustomError(codes.LOCKED_USER, 'Tài khoản của bạn đã bị khóa');
  }

  const token = jwt.sign({ id: existedUser.id }, SECRETE_KEY);
  return { user: existedUser, token };
};

const verifyAccessToken = async (token) => {
  const data = jwt.verify(token, SECRETE_KEY);
  const { id } = data;
  const user = await userDAO.findOneUser(id);

  if (!user.actived) {
    throw new CustomError(codes.FORBIDDEN, 'Tài khoản của bạn đã bị khóa');
  }
  return user;
};

const changePassword = async (userId, password, newPassword) => {
  const existedUser = await userDAO.findOneUser(userId);
  if (!existedUser) {
    throw new CustomError(codes.EMAIL_NOT_EXIST, 'User id is not exist');
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existedUser.password);
  } catch (error) {
    throw new CustomError(codes.UNAUTHORIZED, 'Cannot verify old password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await userDAO.updateUser(userId, { password: hashedPassword });
  return user;
};

module.exports = {
  signup,
  login,
  verifyAccessToken,
  changePassword,
};
