const Test = require('../models/test');
const {
  Types: { ObjectId },
} = require('mongoose');

const createTest = async ({ ...info }) => {
  const test = await Test.create(info);
  return test;
};

const findOneTest = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const test = await Test.findById(condition);
    return test;
  }
  if (typeof condition === 'object' && condition !== null) {
    const test = await Test.findOne(condition).exec();
    return test;
  }
  return null;
};

const findTests = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const tests = await Test.find(condition).exec();
    return tests;
  }
  return null;
};

const updateTest = async (testId, data) => {
  const test = await Test.findByIdAndUpdate(testId, data, { new: true }).exec();
  return test;
};

const updateOneTestByCondition = async (condition, data) => {
  const test = await Test.findOneAndUpdate(condition, data, {
    new: true,
  }).exec();
  return test;
};

const deleteTest = async (testId) => {
  await Test.findByIdAndDelete(testId);
};

module.exports = {
  createTest,
  findOneTest,
  findTests,
  updateTest,
  updateOneTestByCondition,
  deleteTest,
};
