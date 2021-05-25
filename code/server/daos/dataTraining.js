const DataTraining = require('../models/dataTraining');
const {
  Types: { ObjectId },
} = require('mongoose');

const createDataTraining = async ({ ...info }) => {
  const dataTraining = await DataTraining.create(info);
  return dataTraining;
};

const findOneDataTraining = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const dataTraining = await DataTraining.findById(condition);
    return dataTraining;
  }
  if (typeof condition === 'object' && condition !== null) {
    const dataTraining = await DataTraining.findOne(condition).exec();
    return dataTraining;
  }
  return null;
};

const findDataTrainings = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const dataTrainings = await DataTraining.find(
      condition,
      '-password',
    ).exec();
    return dataTrainings;
  }
  return null;
};

const deleteDataTraining = async (dataTrainingId) => {
  await DataTraining.findByIdAndDelete(dataTrainingId);
};

module.exports = {
  createDataTraining,
  findOneDataTraining,
  findDataTrainings,
  deleteDataTraining,
};
