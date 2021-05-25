const router = require('express').Router();
const { auth } = require('../middlewares/checkAuth');
const userControllers = require('../controllers/user');
const asyncWrapper = require('../middlewares/asyncWrapper');
const fileUpload = require('../middlewares/fileUpload');

router.get('/users', auth, asyncWrapper(userControllers.getListUser));

router.get('/user', auth, asyncWrapper(userControllers.getOneUserByQuery));

router.patch('/users/update', auth, asyncWrapper(userControllers.updateUser));

router.get('/user/:id', auth, asyncWrapper(userControllers.getUserById));

router.get(
  '/competitions',
  auth,
  asyncWrapper(userControllers.getListCompetition),
);

router.get('/get-all-emails', asyncWrapper(userControllers.getListUserEmail));

router.get(
  '/competition/verify-email',
  auth,
  asyncWrapper(userControllers.verifyEmailsToCreateTeam),
);

router.get(
  '/competition/teams',
  auth,
  asyncWrapper(userControllers.getListTeamInfo),
);

router.post(
  '/competition/create-team',
  auth,
  asyncWrapper(userControllers.createTeam),
);

router.post(
  '/confirm-join-team',
  auth,
  asyncWrapper(userControllers.confirmUserJoinTeam),
);

router.get(
  '/competition/team-info/:uid/:cid',
  auth,
  asyncWrapper(userControllers.getTeamInforOfUser),
);

router.get(
  '/competition/team/:tid',
  auth,
  asyncWrapper(userControllers.getTeamById),
);

// lấy các team trong competition có id là cid
router.get(
  '/competition/get-teams/:cid',
  auth,
  asyncWrapper(userControllers.getListTeamInCompetition),
);

router.get(
  '/competition/verify/get-audio/:tid',
  auth,
  asyncWrapper(userControllers.getAudioForTeamToVerify),
);

router.put(
  '/competition/verify-audio/input',
  auth,
  asyncWrapper(userControllers.inputContentAudio),
);

router.put(
  '/competition/verify-audio/vote',
  auth,
  asyncWrapper(userControllers.voteForAudio),
);

router.post(
  '/competition/request-data',
  auth,
  fileUpload.single('commitment'),
  asyncWrapper(userControllers.requestData),
);

router.get(
  '/competition/data-training/:cid/:tid',
  auth,
  asyncWrapper(userControllers.getDataTrainingForUser),
);

router.post(
  '/competition/submit-result',
  auth,
  fileUpload.single('file'),
  asyncWrapper(userControllers.submitResult),
);

router.get(
  '/competition/:id',
  auth,
  asyncWrapper(userControllers.getCompetitionById),
);

router.get(
  '/audio-in-competition/:aid',
  auth,
  asyncWrapper(userControllers.getAudioInCompetitionById),
);

router.get(
  '/test/all-public-test',
  auth,
  asyncWrapper(userControllers.getAllPublicTest),
);

router.get(
  '/test/all-private-test-for-user/:uid',
  auth,
  asyncWrapper(userControllers.getPrivateTestsForUser),
);

router.get(
  '/test/get-user-in-test',
  auth,
  asyncWrapper(userControllers.getOneUserInTest),
);

router.get(
  '/test/get-by-id/:testId',
  auth,
  asyncWrapper(userControllers.getTestById),
);

router.post(
  '/test/join-public-test',
  auth,
  asyncWrapper(userControllers.joinPublicTest),
);

router.get(
  '/user-in-test/:userInTestId',
  auth,
  asyncWrapper(userControllers.getUserInTestById),
);

router.get(
  '/audio-in-test/:audioInTestId',
  auth,
  asyncWrapper(userControllers.getAudioInTestById),
);

router.patch(
  '/audio-in-test/MOS/evaluate',
  auth,
  asyncWrapper(userControllers.updateEvaluatingAudioInMOSTest),
);

router.get(
  '/test/audios-in-test/:testId',
  auth,
  asyncWrapper(userControllers.getAudiosInTest),
);

router.get(
  '/test/users-in-test/detail/:testId',
  auth,
  asyncWrapper(userControllers.getAllUsersInTestDetail),
);

router.post(
  '/competition/submit-report',
  auth,
  fileUpload.single('file'),
  asyncWrapper(userControllers.submitReport),
);

router.get(
  '/test/tests-for-team/:teamId',
  auth,
  asyncWrapper(userControllers.getTestForTeam),
);

router.get(
  '/test/audios-in-test-of-team',
  auth,
  asyncWrapper(userControllers.getAllAudiosInTestOfTeam),
);

module.exports = router;
