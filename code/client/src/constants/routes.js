// uid: userId || cid: competitionId || tid: teamId || aicid: audioInCompetitionId || testId : testId || uitId: userInTestId

export default {
  //public
  SIGNUP: '/signup',
  LOGIN: '/login',

  // private
  CHANGE_PASSWORD: '/change-password',
  HOME: '/',
  USER_INFORMATION: '/user/information',

  // admin
  ADMIN_HOME: '/admin',
  CREATE_USER: '/admin/create-user',

  // manager
  USER_MANAGEMENT: '/user-management',
  COMPETITION_MANAGEMENT: '/competition-management',
  CREATE_COMPETITION: '/competition/create',
  COMPETITION_MANAGER: '/competition-manager/:cid',
  VIEW_TEST_DETAIL: '/test/view-detail/:testId',
  VIEW_VERIFICATION_RESULT: '/competition/verification-result/:cid',

  // user
  // tid là teamId
  VIEW_LIST_COMPETITION: '/competition/list',
  REGISTER_COMPETITION: '/competition/register/:cid',
  CONFIRM_JOIN_TEAM: '/confirm-join-team/:token',
  COMPETITION_USER: '/competition-user/:cid',
  START_VERIFY_AUDIO: '/competition/start-verify-audio/:tid',
  TEAM_VERIFY_AUDIO: '/competition/verify-audio/:tid',
  TEAM_VERIFY_SUCCESS: '/competition/verify-success/:cid',
  TEAM_REQUEST_DATA: '/competition/request-data/:tid',
  TEAM_SUBMIT_RESULT: '/competition/submit-result/:tid',
  START_EVALUATE_AUDIO: '/test/start-evaluate-audio/:testId',
  USER_EVALUATE_AUDIO: '/test/evaluate-audio/:uitId',
  USER_EVALUATE_COMPLETE: '/test/evaluate-complete',
  TEAM_SUBMIT_REPORT: '/competition/submit-report/:tid',
  TEAM_VIEW_TEST_RESULT_DETAIL: '/test/result-detail/:teamId/:testId',
};
