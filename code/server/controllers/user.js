const userService = require('../services/user');
const teamService = require('../services/team');
const competitionService = require('../services/competition');
const audioInCompetitionService = require('../services/audioInCompetition');
const testService = require('../services/test');

const getOneUserByQuery = async (req, res, next) => {
  const user = await userService.getOneUser(req.query);
  console.log(req.query);
  res.json({
    status: 1,
    user,
  });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const user = await userService.getOneUser(userId);
  res.json({
    status: 1,
    user,
  });
};

const updateUser = async (req, res, next) => {
  const { name, job } = req.body;
  const userId = req.user.id;
  const user = await userService.updateUser(userId, { name, job });
  //   console.log('at update user : ', user);
  res.json({
    status: 1,
    message: 'Update user',
    user,
  });
};

const getListUser = async (req, res, next) => {
  const users = await userService.getUsers({ role: 'user' });
  res.json({
    status: 1,
    users,
  });
};

const getListCompetition = async (req, res, next) => {
  const competitions = await competitionService.getCompetitions({});
  // console.log('at competition controller', competitions);
  res.json({
    status: 1,
    competitions,
  });
};

const getCompetitionById = async (req, res, next) => {
  const competitionId = req.params.id;
  const competition = await competitionService.getOneCompetition(competitionId);
  // console.log('at user controller get competition by id', competition);
  res.json({
    status: 1,
    competition,
  });
};

const getListUserEmail = async (req, res, next) => {
  const listEmails = await userService.getAllUserEmail();
  res.json({ status: 1, listEmails });
};

const verifyEmailsToCreateTeam = async (req, res, next) => {
  const { emailsString, competitionId } = req.query;
  await teamService.verifyEmailsToCreateTeam(emailsString, competitionId);
  res.json({
    status: 1,
    message: 'All email is valid',
  });
};

const createTeam = async (req, res, next) => {
  const { competitionId, teamInfo } = req.body;
  const { team, message } = await teamService.createTeam(
    competitionId,
    teamInfo,
  );
  // const x = await teamService.createTeam(competitionId, teamInfo);
  // console.log('x = ', x);
  res.json({ status: 1, team, message });
};

const confirmUserJoinTeam = async (req, res, next) => {
  const { token } = req.body;
  await teamService.confirmUserJoinTeam(token);
  res.json({
    status: 1,
    message: 'Join team success',
  });
};

const getListTeamInfo = async (req, res, next) => {
  const { teams } = await teamService.getListTeamInfo();
  res.json({
    status: 1,
    teams,
  });
};

const getListTeamInCompetition = async (req, res, next) => {
  const competitionId = req.params.cid;
  const { teams } = await teamService.getListTeamInCompetition(competitionId);
  res.json({
    status: 1,
    teams,
  });
};

const getTeamInforOfUser = async (req, res, next) => {
  const uid = req.params.uid;
  const cid = req.params.cid;
  const { team, members } = await teamService.getTeamInforOfUser({ uid, cid });
  // console.log(members);
  res.json({
    status: 1,
    team,
    members,
  });
};

const getTeamById = async (req, res, next) => {
  const teamId = req.params.tid;
  const team = await teamService.getTeamById(teamId);
  res.json({
    status: 1,
    team,
  });
};

const getAudioInCompetitionById = async (req, res, next) => {
  const audioInCompetitionId = req.params.aid;
  const audioInCompetition =
    await audioInCompetitionService.getAudioInCompetitionById(
      audioInCompetitionId,
    );
  res.json({
    status: 1,
    audioInCompetition,
  });
};

const inputContentAudio = async (req, res, next) => {
  const data = req.body;
  const { message } = await audioInCompetitionService.inputContentAudio(data);
  res.json({ status: 1, message });
};

const voteForAudio = async (req, res, next) => {
  const data = req.body;
  const { message } = await audioInCompetitionService.voteForAudio(data);
  res.json({ status: 1, message: 'Cập nhật bình chọn thành công' });
};

const requestData = async (req, res, next) => {
  const { teamId } = req.body;
  const commitmentFile = req.file;
  const { message } = await competitionService.requestData({
    teamId,
    commitmentFile,
  });

  res.json({
    status: 1,
    message,
  });
};

const getDataTrainingForUser = async (req, res, next) => {
  const { cid: competitionId, tid: teamId } = req.params;
  const { dataTraining } = await competitionService.getDataTrainingForUser({
    competitionId,
    teamId,
  });
  res.json({
    status: 1,
    dataTraining,
  });
};

const getAudioForTeamToVerify = async (req, res, next) => {
  const { tid: teamId } = req.params;
  const { audio } = await audioInCompetitionService.getAudioForTeamToVerify(
    teamId,
  );

  res.json({
    status: 1,
    audio,
  });
};

const submitResult = async (req, res, next) => {
  const file = req.file;
  const { competitionId, teamId } = req.body;
  const { message } = await competitionService.submitResult({
    competitionId,
    teamId,
    file,
  });
  res.json({
    status: 1,
    message,
  });
};

const getAllPublicTest = async (req, res, next) => {
  const { tests } = await testService.getAllPublicTest();
  res.json({
    status: 1,
    tests,
  });
};

const getPrivateTestsForUser = async (req, res, next) => {
  const { uid: userId } = req.params;
  const { tests } = await testService.getPrivateTestsForUser({ userId });
  res.json({
    status: 1,
    tests,
  });
};

const getTestById = async (req, res, next) => {
  const { testId } = req.params;
  const { test } = await testService.getTestById(testId);

  res.json({
    status: 1,
    test,
  });
};

const getOneUserInTest = async (req, res, next) => {
  const { userId, testId } = req.query;
  const { userInTest } = await testService.getOneUserInTest({ userId, testId });
  res.json({
    status: 1,
    userInTest,
  });
};

const joinPublicTest = async (req, res, next) => {
  const { userId, testId } = req.body;
  const { userInTest } = await testService.joinPublicTest({ userId, testId });
  res.json({
    status: 1,
    userInTest,
    message: 'Bắt đầu tham gia bài thí nghiệm',
  });
};

const getUserInTestById = async (req, res, next) => {
  const { userInTestId } = req.params;
  const { userInTest } = await testService.getUserInTestById(userInTestId);
  res.json({
    status: 1,
    userInTest,
  });
};

const getAudioInTestById = async (req, res, next) => {
  const { audioInTestId } = req.params;
  const { audioInTest } = await testService.getAudioInTestById(audioInTestId);
  res.json({
    status: 1,
    audioInTest,
  });
};

const updateEvaluatingAudioInMOSTest = async (req, res, next) => {
  const { message } = await testService.updateEvaluatingAudioInMOSTest(
    req.body,
  );
  res.json({
    status: 1,
    message,
  });
};

const getAudiosInTest = async (req, res, next) => {
  const { testId } = req.params;
  const { audiosInTest } = await testService.getAudiosInTest(testId);
  res.json({
    status: 1,
    audiosInTest,
  });
};

const getAllUsersInTestDetail = async (req, res, next) => {
  const { testId } = req.params;
  const { allUsersInTestDetail } = await testService.getAllUsersInTestDetail(
    testId,
  );
  res.json({
    status: 1,
    allUsersInTestDetail,
  });
};

const submitReport = async (req, res, next) => {
  const file = req.file;
  const { competitionId, teamId } = req.body;
  const { message } = await competitionService.submitReport({
    competitionId,
    teamId,
    file,
  });
  res.json({
    status: 1,
    message,
  });
};

const getTestForTeam = async (req, res, next) => {
  const { teamId } = req.params;
  // console.log('teamId', teamId);
  const { tests } = await testService.getTestForTeam(teamId);
  // console.log('tests', tests);
  res.json({
    status: 1,
    tests,
  });
};

const getAllAudiosInTestOfTeam = async (req, res, next) => {
  const { teamId, testId } = req.query;
  const { audiosInTest } = await testService.getAllAudiosInTestOfTeam({
    teamId,
    testId,
  });
  res.json({
    status: 1,
    audiosInTest,
  });
};

module.exports = {
  getOneUserByQuery,
  getUserById,
  updateUser,
  getListUser,
  getListCompetition,
  getCompetitionById,
  createTeam,
  verifyEmailsToCreateTeam,
  confirmUserJoinTeam,
  getListUserEmail,
  getListTeamInfo,
  getListTeamInCompetition,
  getTeamInforOfUser,
  getTeamById,
  getAudioInCompetitionById,
  inputContentAudio,
  voteForAudio,
  requestData,
  getDataTrainingForUser,
  getAudioForTeamToVerify,
  submitResult,
  getAllPublicTest,
  getPrivateTestsForUser,
  getTestById,
  getOneUserInTest,
  joinPublicTest,
  getUserInTestById,
  getAudioInTestById,
  updateEvaluatingAudioInMOSTest,
  getAudiosInTest,
  getAllUsersInTestDetail,
  submitReport,
  getTestForTeam,
  getAllAudiosInTestOfTeam,
};
