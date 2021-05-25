const UserInTest = require('../models/userInTest');
const {
  Types: { ObjectId },
} = require('mongoose');

const createUserInTest = async ({ ...info }) => {
  const userInTest = await UserInTest.create(info);
  return userInTest;
};

const findOneUserInTest = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const userInTest = await UserInTest.findById(condition);
    return userInTest;
  }
  if (typeof condition === 'object' && condition !== null) {
    const userInTest = await UserInTest.findOne(condition).exec();
    return userInTest;
  }
  return null;
};

const findUsersInTest = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const userInTest = await UserInTest.find(condition).exec();
    return userInTest;
  }
  return null;
};

const updateUserInTestById = async (userInTestId, data) => {
  const userInTest = await UserInTest.findByIdAndUpdate(userInTestId, data, {
    new: true,
  }).exec();
  return userInTest;
};

const updateOneUserInTestByCondition = async (condition, data) => {
  const userInTest = await UserInTest.findOneAndUpdate(condition, data, {
    new: true,
  }).exec();
  return userInTest;
};

const deleteUserInTest = async (userInTestId) => {
  await UserInTest.findByIdAndDelete(userInTestId);
};

module.exports = {
  createUserInTest,
  findOneUserInTest,
  findUsersInTest,
  updateUserInTestById,
  updateOneUserInTestByCondition,
  deleteUserInTest,
};
