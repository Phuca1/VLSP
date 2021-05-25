const AudioInTest = require('../models/audioInTest');
const {
  Types: { ObjectId },
} = require('mongoose');

const createAudioInTest = async ({ ...info }) => {
  const audioInTest = await AudioInTest.create(info);
  return audioInTest;
};

const findOneAudioInTest = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const audioInTest = await AudioInTest.findById(condition);
    return audioInTest;
  }
  if (typeof condition === 'object' && condition !== null) {
    const audioInTest = await AudioInTest.findOne(condition).exec();
    return audioInTest;
  }
  return null;
};

const findAudiosInTest = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const audioInTest = await AudioInTest.find(condition).exec();
    return audioInTest;
  }
  return null;
};

const updateAudioInTestById = async (audioInTestId, data) => {
  const audioInTest = await AudioInTest.findByIdAndUpdate(audioInTestId, data, {
    new: true,
  }).exec();
  return audioInTest;
};

const updateOneAudioInTestByCondition = async (condition, data) => {
  const audioInTest = await AudioInTest.findOneAndUpdate(condition, data, {
    new: true,
  }).exec();
  return audioInTest;
};

const deleteAudioInTest = async (audioInTestId) => {
  await AudioInTest.findByIdAndDelete(audioInTestId);
};

module.exports = {
  createAudioInTest,
  findOneAudioInTest,
  findAudiosInTest,
  updateAudioInTestById,
  updateOneAudioInTestByCondition,
  deleteAudioInTest,
};
