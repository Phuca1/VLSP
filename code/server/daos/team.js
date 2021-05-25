const Team = require('../models/team');
const {
  Types: { ObjectId },
} = require('mongoose');

const createTeam = async ({ ...info }) => {
  const team = await Team.create(info);
  return team;
};

const findOneTeam = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const team = await Team.findById(condition);
    return team;
  }
  if (typeof condition === 'object' && condition !== null) {
    const user = await Team.findOne(condition).exec();
    return user;
  }
  return null;
};

const findTeams = async (condition) => {
  if (typeof condition === 'object' && condition !== null) {
    const teams = await Team.find(condition).exec();
    return teams;
  }
  return null;
};

const updateTeamById = async (teamId, data) => {
  const team = await Team.findByIdAndUpdate(teamId, data, { new: true }).exec();
  return team;
};

const updateOneTeamByCondition = async (condition, data) => {
  const team = await Team.findOneAndUpdate(condition, data, {
    new: true,
  }).exec();
  return team;
};

const deleteTeamById = async (teamId) => {
  await Team.findByIdAndDelete(teamId);
};

const deleteOneTeamByCondition = async (teamId) => {
  await Team.findByIdAndDelete(teamId);
};

module.exports = {
  createTeam,
  findOneTeam,
  findTeams,
  updateTeamById,
  updateOneTeamByCondition,
  deleteOneTeamByCondition,
  deleteTeamById,
};
