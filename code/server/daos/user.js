const User = require('../models/user');
const {
  Types: { ObjectId },
} = require('mongoose');

const createUser = async ({ ...info }) => {
  const user = await User.create(info);
  return user;
};

const findOneUser = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const user = await User.findById(condition);
    return user;
  }
  if (typeof condition === 'object' && condition !== null) {
    const user = await User.findOne(condition).exec();
    return user;
  }
  return null;
};

const findUsers = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const users = await User.find(condition, '-password').exec();
    return users;
  }
  return null;
};

const updateUser = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true }).exec();
  return user;
};

const updateOneUserByCondition = async (condition, data) => {
  const user = await User.findOneAndUpdate(condition, data, {
    new: true,
  }).exec();
  return user;
};

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

module.exports = {
  createUser,
  findOneUser,
  findUsers,
  updateUser,
  updateOneUserByCondition,
  deleteUser,
};
