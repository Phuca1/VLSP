// const User = require('../models/user');
const Competition = require('../models/competition');
const {
  Types: { ObjectId },
} = require('mongoose');

const createCompetition = async ({ ...info }) => {
  const competition = await Competition.create(info);
  return competition;
};

const findOneCompetition = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const competition = await Competition.findById(condition);
    return competition;
  }
  if (typeof condition === 'object' && condition !== null) {
    const competition = await Competition.findOne(condition).exec();
    return competition;
  }
  return null;
};

const findCompetitions = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const competitions = await Competition.find(condition).exec();
    // console.log('at competition daos : ', competitions);
    return competitions;
  }
  return null;
};

const updateCompetitionById = async (competitionId, data) => {
  const competition = await Competition.findByIdAndUpdate(competitionId, data, {
    new: true,
  }).exec();
  return competition;
};

const updateOneCompetitionByCondition = async (condition, data) => {
  const competition = await Competition.findOneAndUpdate(condition, data, {
    new: true,
  }).exec();
  return competition;
};

const deleteCompetition = async (competitionId) => {
  await Competition.findByIdAndDelete(competitionId);
};

const deleteOneCompetitionByCondition = async (condition) => {
  await Competition.findOneAndDelete(condition);
};

module.exports = {
  createCompetition,
  findOneCompetition,
  findCompetitions,
  updateCompetitionById,
  updateOneCompetitionByCondition,
  deleteCompetition,
};
