const router = require('express').Router();
const { auth } = require('../middlewares/checkAuth');
const { managerAuth } = require('../middlewares/checkManager');
const fileUpload = require('../middlewares/fileUpload');

const managerController = require('../controllers/manager');

const asyncWrapper = require('../middlewares/asyncWrapper');

router.post(
  '/competition/create',
  auth,
  managerAuth,
  asyncWrapper(managerController.createCompetition),
);

router.patch(
  '/competition/update',
  auth,
  managerAuth,
  asyncWrapper(managerController.updateCompetition),
);

router.post(
  '/competition/create-verification-task',
  fileUpload.single('audio'),
  auth,
  managerAuth,
  asyncWrapper(managerController.createVerifyDataTask),
);

router.post(
  '/competition/verify/notification-progress',
  auth,
  managerAuth,
  asyncWrapper(managerController.notifyVerifyData),
);

router.get(
  '/competition/audios-in-one-competition/:cid',
  auth,
  managerAuth,
  asyncWrapper(managerController.getAudiosInOneCompetition),
);

router.patch(
  '/competition/update-threshold',
  auth,
  managerAuth,
  asyncWrapper(managerController.updateThreshold),
);

router.post(
  '/competition/share-data',
  auth,
  managerAuth,
  fileUpload.fields([{ name: 'data' }, { name: 'commitmentTemplate' }]),
  asyncWrapper(managerController.shareData),
);

// did : dataTraining ID
router.get(
  '/competition/data-training/:did',
  auth,
  managerAuth,
  asyncWrapper(managerController.getDataTrainingById),
);

router.get(
  '/competition/requested-teams/:cid',
  auth,
  managerAuth,
  asyncWrapper(managerController.getRequestTeams),
);

router.patch(
  '/competition/confirm-share-data',
  auth,
  managerAuth,
  asyncWrapper(managerController.confirmShareData),
);

router.post(
  '/competition/create-submission-task',
  auth,
  managerAuth,
  asyncWrapper(managerController.createTaskSubmission),
);

router.patch(
  '/competition/update-submission-task',
  auth,
  managerAuth,
  asyncWrapper(managerController.updateTaskSubmission),
);

router.get(
  '/competition/get-team-submitted-result/:cid',
  auth,
  managerAuth,
  asyncWrapper(managerController.getTeamsWhoSubmittedResult),
);

router.get(
  '/test/get-test-in-competition/:cid',
  auth,
  managerAuth,
  asyncWrapper(managerController.getTestsInCompetition),
);

router.get(
  '/competition/users/not-join/:cid',
  auth,
  managerAuth,
  asyncWrapper(managerController.getUserDoNotJoinCompetition),
);

router.post(
  '/test/create',
  fileUpload.single('data'),
  auth,
  managerAuth,
  asyncWrapper(managerController.createTest),
);

router.post(
  '/test/create-latin-square',
  fileUpload.single('data'),
  auth,
  managerAuth,
  asyncWrapper(managerController.createTestLatinSquare),
);

router.post(
  '/competition/create/task-submit-report',
  auth,
  managerAuth,
  asyncWrapper(managerController.createTaskSubmitReport),
);

router.get(
  '/competition/get-team-submitted-report/:cid',
  auth,
  managerAuth,
  asyncWrapper(managerController.getTeamsWhoSubmittedReport),
);

router.post(
  '/test/send-result',
  auth,
  managerAuth,
  asyncWrapper(managerController.sendResultToTeams),
);

module.exports = router;
