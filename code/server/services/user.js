const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const bcrypt = require('bcryptjs');

const userDAO = require('../daos/user');

const getOneUser = async (condition) => {
  const user = await userDAO.findOneUser(condition);
  return user;
};

const getUsers = async (condition) => {
  const users = await userDAO.findUsers(condition);
  return users;
};

const getAllUserEmail = async () => {
  const allUsers = await userDAO.findUsers({ role: 'user' });
  const listEmails = allUsers.map((user) => {
    return user.email;
  });
  return listEmails;
};

const updateUser = async (userId, data) => {
  const user = await userDAO.updateUser(userId, data);
  return user;
};

const getAllUserExceptAdmin = async () => {
  const allUsers = await userDAO.findUsers({ role: { $ne: 'admin' } });
  return { allUsers };
};

const lockUser = async (userId) => {
  const user = await userDAO.findOneUser(userId);
  user.actived = false;
  await user.save();
  return { message: `Đã khóa tài khoản người dùng ${user.name}` };
};

const unlockUser = async (userId) => {
  const user = await userDAO.findOneUser(userId);
  user.actived = true;
  await user.save();
  return { message: `Đã mở khóa tài khoản người dùng ${user.name}` };
};

const createUser = async ({ name, email, password, role, actived }) => {
  const isActived = actived || true;
  console.log('user info', name, email, password, role, actived);
  const existedUser = await userDAO.findOneUser({ email });
  if (existedUser) {
    throw new CustomError(codes.EMAIL_EXISTED, 'Email existed');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userDAO.createUser({
    password: hashedPassword,
    email,
    name,
    role,
    actived: isActived,
  });

  return { user: newUser, message: 'Tạo tài khoản thành công' };
};

module.exports = {
  getOneUser,
  getUsers,
  getAllUserEmail,
  updateUser,
  getAllUserExceptAdmin,
  lockUser,
  unlockUser,
  createUser,
};
