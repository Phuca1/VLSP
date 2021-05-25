import routes from '../constants/routes';

import Login from '../pages/authentication/Login';
import Signup from '../pages/authentication/Signup';

import Home from '../pages/home/Home';
import ChangePassword from '../pages/authentication/ChangePassword';
import UserInformation from '../pages/information/UserInformation';

import Competition from '../pages/user/Competition/Competition';
import RegisterCompetition from '../pages/user/Competition/RegisterCompetition/RegisterCompetition';
import ConfirmJoinTeam from '../pages/user/Competition/ConfirmJoinTeam/ConfirmJoinTeam';
import CompetitionUser from '../pages/user/Competition/CompetitionUser/CompetitionUser';
import VerifyAudio from '../pages/user/Competition/VerifyAudio/VerifyAudio';
import RequestData from '../pages/user/Competition/RequestData/RequestData';
import SubmitResult from '../pages/user/Competition/SubmitResult/SubmitResult';
import VerifySuccess from '../pages/user/Competition/VerifyAudio/VerifySuccess';
import StartVerifyAudio from '../pages/user/Competition/VerifyAudio/StartVerifyAudio';

import UserManagement from '../pages/manager/UserManagement/UserManagement';
import CreateCompetition from '../pages/manager/CompetitionManagement/CreateCompetition/CreateCompetition';
import CompetitionManager from '../pages/manager/CompetitionManagement/CompetitionManager/CompetitionManager';
import CompetitionManagement from '../pages/manager/CompetitionManagement/CompetitionManagement';
import TestDetail from '../pages/manager/CompetitionManagement/TestDetail/TestDetail';
import StartEvaluateAudio from '../pages/user/Test/StartEvaluateAudio/StartEvaluateAudio';
import EvaluateAudio from '../pages/user/Test/EvaluateAudio';
import EvaluateComplete from '../pages/user/Test/EvaluateComplete/EvaluateComplete';
import SubmitReport from '../pages/user/Competition/SubmitReport/SubmitReport';
import Admin from '../pages/admin/admin';
import CreateUser from '../pages/admin/CreateUser/CreateUser';
import VerificationResult from '../pages/manager/CompetitionManagement/VerificationResult/VerificationResult';
import TestResultDetail from '../pages/user/Test/TestResultDetail/TestResultDetail';

export default [
  //public
  {
    path: routes.SIGNUP,
    component: Signup,
    exact: true,
    access: 'auth',
  },
  {
    path: routes.LOGIN,
    component: Login,
    exact: true,
    access: 'auth',
  },

  //private
  {
    path: routes.HOME,
    component: Home,
    exact: true,
    access: 'private',
  },
  {
    path: routes.CHANGE_PASSWORD,
    component: ChangePassword,
    exact: true,
    access: 'private',
  },
  {
    path: routes.USER_INFORMATION,
    component: UserInformation,
    exact: true,
    access: 'private',
  },

  //admin

  {
    path: routes.ADMIN_HOME,
    component: Admin,
    exact: true,
    access: 'admin',
  },
  {
    path: routes.CREATE_USER,
    component: CreateUser,
    exact: true,
    access: 'admin',
  },
  //manager
  {
    path: routes.USER_MANAGEMENT,
    component: UserManagement,
    exact: true,
    access: 'manager',
  },

  {
    path: routes.COMPETITION_MANAGEMENT,
    component: CompetitionManagement,
    exact: true,
    access: 'manager',
  },
  {
    path: routes.CREATE_COMPETITION,
    component: CreateCompetition,
    exact: true,
    access: 'manager',
  },
  {
    path: routes.COMPETITION_MANAGER,
    component: CompetitionManager,
    exact: true,
    access: 'manager',
  },
  {
    path: routes.VIEW_TEST_DETAIL,
    component: TestDetail,
    exact: true,
    access: 'manager',
  },
  {
    path: routes.VIEW_VERIFICATION_RESULT,
    component: VerificationResult,
    exact: true,
    access: 'manager',
  },

  //user
  {
    path: routes.VIEW_LIST_COMPETITION,
    component: Competition,
    exact: true,
    access: 'user',
  },
  {
    path: routes.REGISTER_COMPETITION,
    component: RegisterCompetition,
    exact: true,
    access: 'user',
  },
  {
    path: routes.CONFIRM_JOIN_TEAM,
    component: ConfirmJoinTeam,
    exact: true,
    access: 'user',
  },
  {
    path: routes.COMPETITION_USER,
    component: CompetitionUser,
    exact: true,
    access: 'user',
  },
  {
    path: routes.START_VERIFY_AUDIO,
    component: StartVerifyAudio,
    exact: true,
    access: 'user',
  },
  {
    path: routes.TEAM_VERIFY_AUDIO,
    component: VerifyAudio,
    exact: true,
    access: 'user',
  },
  {
    path: routes.TEAM_VERIFY_SUCCESS,
    component: VerifySuccess,
    exact: true,
    access: 'user',
  },
  {
    path: routes.TEAM_REQUEST_DATA,
    component: RequestData,
    exact: true,
    access: 'user',
  },
  {
    path: routes.TEAM_SUBMIT_RESULT,
    component: SubmitResult,
    exact: true,
    access: 'user',
  },
  {
    path: routes.START_EVALUATE_AUDIO,
    component: StartEvaluateAudio,
    exact: true,
    access: 'user',
  },
  {
    path: routes.USER_EVALUATE_AUDIO,
    component: EvaluateAudio,
    exact: true,
    access: 'user',
  },
  {
    path: routes.USER_EVALUATE_COMPLETE,
    component: EvaluateComplete,
    exact: true,
    access: 'user',
  },
  {
    path: routes.TEAM_SUBMIT_REPORT,
    component: SubmitReport,
    exact: true,
    access: 'user',
  },
  {
    path: routes.TEAM_VIEW_TEST_RESULT_DETAIL,
    component: TestResultDetail,
    exact: true,
    access: 'user',
  },
];
