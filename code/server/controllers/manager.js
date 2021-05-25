const competitionService = require('../services/competition');
const testService = require('../services/test');
const audioInCompetitionService = require('../services/audioInCompetition');
const createCompetition = async (req, res, next) => {
  const info = { ...req.body };
  const competition = await competitionService.createCompetition(info);
  res.json({
    status: 1,
    message: 'Competition created',
    competition,
  });
};

const updateCompetition = async (req, res, next) => {
  const { competitionId, ...rest } = req.body;
  const competition = competitionService.updateCompetitionById(
    competitionId,
    rest,
  );
  res.json({
    status: 1,
    message: 'Update competition success',
    competition,
  });
};

const createVerifyDataTask = async (req, res, next) => {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const { message } = await competitionService.createVerifyDataTask({
    file: req.file,
    verifyDataTaskInfo: JSON.parse(req.body.verifyDataTaskInfo),
    competitionId: req.body.competitionId,
  });

  res.json({
    status: 1,
    message,
  });
};

const notifyVerifyData = async (req, res, next) => {
  const { message } = await competitionService.notifyVerifyData(req.body);
  res.json({
    status: 1,
    message,
  });
};

const getAudiosInOneCompetition = async (req, res, next) => {
  const { cid: competitionId } = req.params;
  const { audiosInCompetition } =
    await audioInCompetitionService.getAudiosInOneCompetition(competitionId);
  res.json({
    status: 1,
    audiosInCompetition,
  });
};

const updateThreshold = async (req, res, next) => {
  const { message } = await competitionService.updateThreshold(req.body);
  res.json({
    status: 1,
    message,
  });
};

const shareData = async (req, res, next) => {
  // console.log(req.files);
  // console.log(req.body);

  const files = req.files;
  const { competitionId, dataDescription } = req.body;
  const resp = await competitionService.shareData({
    files,
    competitionId,
    dataDescription,
  });
  res.json({ status: 1, resp });
};

const getDataTrainingById = async (req, res, next) => {
  const dataTrainingId = req.params.did;
  const dataTraining = await competitionService.getDataTrainingById(
    dataTrainingId,
  );
  res.json({
    status: 1,
    dataTraining,
  });
};

const getRequestTeams = async (req, res, next) => {
  const competitionId = req.params.cid;
  const { requestTeams } = await competitionService.getRequestTeams(
    competitionId,
  );

  res.json({
    status: 1,
    requestTeams,
  });
};

const confirmShareData = async (req, res, next) => {
  const { competitionId, teamId } = req.body;
  const { message } = await competitionService.confirmShareData({
    competitionId,
    teamId,
  });

  res.json({
    status: 1,
    message,
  });
};

const createTaskSubmission = async (req, res, next) => {
  const { message } = await competitionService.createTaskSubmission(req.body);
  res.json({
    status: 1,
    message,
  });
};

const updateTaskSubmission = async (req, res, next) => {
  const { message } = await competitionService.updateTaskSubmission(req.body);
  res.json({
    status: 1,
    message,
  });
};

const getTeamsWhoSubmittedResult = async (req, res, next) => {
  const competitionId = req.params.cid;
  const { teamSubmitted } = await competitionService.getTeamsWhoSubmittedResult(
    { competitionId },
  );
  res.json({
    status: 1,
    teamSubmitted,
  });
};

const getTestsInCompetition = async (req, res, next) => {
  const { cid: competitionId } = req.params;
  const { tests } = await testService.getTestsInCompetition(competitionId);
  res.json({
    status: 1,
    tests,
  });
};

const getUserDoNotJoinCompetition = async (req, res, next) => {
  const { cid: competitionId } = req.params;
  const { candidates } = await competitionService.getUserDoNotJoinCompetition(
    competitionId,
  );
  res.json({
    status: 1,
    candidates,
  });
};

const createTest = async (req, res, next) => {
  const { test } = await testService.createTest({
    testInfo: req.body,
    file: req.file,
  });
  res.json({
    status: 1,
    message: 'Create test success',
    test,
  });
};

const createTaskSubmitReport = async (req, res, next) => {
  const { message } = await competitionService.createTaskSubmitReport(req.body);
  res.json({
    status: 1,
    message,
  });
};

const getTeamsWhoSubmittedReport = async (req, res, next) => {
  const competitionId = req.params.cid;
  const { teamSubmitted } = await competitionService.getTeamsWhoSubmittedReport(
    { competitionId },
  );
  res.json({
    status: 1,
    teamSubmitted,
  });
};

const createTestLatinSquare = async (req, res, next) => {
  const { test } = await testService.createTestLatinSquare({
    testInfo: req.body,
    file: req.file,
  });
  res.json({
    status: 1,
    message: 'Create test success',
    test,
  });
};

const sendResultToTeams = async (req, res, next) => {
  const { testId } = req.body;
  const { message } = await testService.sendResultToTeams(testId);
  res.json({
    status: 1,
    message,
  });
};

module.exports = {
  createCompetition,
  updateCompetition,
  createVerifyDataTask,
  notifyVerifyData,
  getAudiosInOneCompetition,
  updateThreshold,
  shareData,
  getDataTrainingById,
  getRequestTeams,
  confirmShareData,
  createTaskSubmission,
  updateTaskSubmission,
  getTeamsWhoSubmittedResult,
  getTestsInCompetition,
  getUserDoNotJoinCompetition,
  createTest,
  createTaskSubmitReport,
  getTeamsWhoSubmittedReport,
  createTestLatinSquare,
  sendResultToTeams,
};
