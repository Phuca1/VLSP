const AudioInCompetition = require('../models/audioInCompetition');
const {
  Types: { ObjectId },
} = require('mongoose');

const createAudioInCompetition = async ({ ...info }) => {
  const audioInCompetition = await AudioInCompetition.create(info);
  return audioInCompetition;
};

const findOneAudioIncompetition = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const audioInCompetition = await AudioInCompetition.findById(condition);
    return audioInCompetition;
  }
  if (typeof condition === 'object' && condition !== null) {
    const audioInCompetition = await AudioInCompetition.findOne(
      condition,
    ).exec();
    return audioInCompetition;
  }
  return null;
};

const findAudiosInCompetition = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const audioInCompetition = await AudioInCompetition.find(condition).exec();
    return audioInCompetition;
  }
  return null;
};

const updateAudioInCompetitionById = async (audioInCompetitionId, data) => {
  const audioInCompetition = await AudioInCompetition.findByIdAndUpdate(
    audioInCompetitionId,
    data,
    { new: true },
  ).exec();
  return audioInCompetition;
};

const updateOneAudioInCompetitionByCondition = async (condition, data) => {
  const audioInCompetition = await AudioInCompetition.findOneAndUpdate(
    condition,
    data,
    {
      new: true,
    },
  ).exec();
  return audioInCompetition;
};

const deleteAudioInCompetition = async (audioInCompetitionId) => {
  await AudioInCompetition.findByIdAndDelete(audioInCompetitionId);
};

module.exports = {
  createAudioInCompetition,
  findOneAudioIncompetition,
  findAudiosInCompetition,
  updateAudioInCompetitionById,
  updateOneAudioInCompetitionByCondition,
  deleteAudioInCompetition,
};
