import api from '../api';
import apiInfinite from '../apiInfinite';
export async function getListUser() {
  const res = await api({
    method: 'GET',
    url: '/users',
  });
  return res;
}

export async function updateUser(name, job) {
  const res = await api({
    method: 'PATCH',
    url: '/users/update',
    data: {
      name,
      job,
    },
  });
  return res;
}

export async function getListCompetitions() {
  const res = await api({
    method: 'GET',
    url: '/competitions',
  });
  return res;
}

export async function getCompetitionById({ competitionId }) {
  // console.log('at user api : ', competitionId);
  const res = await api({
    method: 'GET',
    url: `/competition/${competitionId}`,
  });
  return res;
}

export async function getAllUserEmails() {
  const res = await api({
    method: 'GET',
    url: `/get-all-emails`,
  });
  return res;
}

export async function verifyListEmails(emailsString, competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/verify-email?emailsString=${emailsString}&competitionId=${competitionId}`,
  });
  return res;
}

export async function createTeam(data) {
  const res = await api({
    method: 'POST',
    url: `/competition/create-team`,
    data: data,
  });
  return res;
}

export async function confirmJoinTeam(data) {
  const res = await api({
    method: 'POST',
    url: `/confirm-join-team`,
    data: data,
  });
  return res;
}

export async function getListTeam() {
  const res = await api({
    method: 'GET',
    url: `/competition/teams`,
  });
  return res;
}

export async function getListTeamInCompetition(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/get-teams/${competitionId}`,
  });
  return res;
}

export async function getUserById(userId) {
  const res = await api({
    method: 'GET',
    url: `/user/${userId}`,
  });
  return res;
}

export async function getTeamInforOfUser({ uid, cid }) {
  const res = await api({
    method: 'GET',
    url: `/competition/team-info/${uid}/${cid}`,
  });
  return res;
}

export async function getTeamById(teamId) {
  const res = await api({
    method: 'GET',
    url: `/competition/team/${teamId}`,
  });
  return res;
}

export async function getAudioInCompetitionById(audioInCompetitionId) {
  const res = await api({
    method: 'GET',
    url: `/audio-in-competition/${audioInCompetitionId}`,
  });
  return res;
}

export async function getAudioForTeamToVerify(teamId) {
  const res = await api({
    method: 'GET',
    url: `/competition/verify/get-audio/${teamId}`,
  });
  return res;
}

export async function inputContentAudio(data) {
  const res = await api({
    method: 'PUT',
    url: '/competition/verify-audio/input',
    data: data,
  });
  return res;
}

export async function voteForAudio(data) {
  const res = await api({
    method: 'PUT',
    url: '/competition/verify-audio/vote',
    data: data,
  });
  return res;
}

export async function requestData(data) {
  const res = await apiInfinite({
    method: 'POST',
    url: `/competition/request-data`,
    data: data,
  });
  return res;
}

export async function getDataTrainingForUser({ competitionId, teamId }) {
  const res = await api({
    method: 'GET',
    url: `/competition/data-training/${competitionId}/${teamId}`,
  });
  return res;
}

export async function submitResult(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/submit-result',
    data: data,
  });
  return res;
}

export async function getAllPublicTest() {
  const res = await api({
    method: 'GET',
    url: `/test/all-public-test`,
  });
  return res;
}

export async function getPrivateTestsForUser(userId) {
  const res = await api({
    method: 'GET',
    url: `/test/all-private-test-for-user/${userId}`,
  });
  return res;
}

export async function getTestById(testId) {
  const res = await api({
    method: 'GET',
    url: `/test/get-by-id/${testId}`,
  });
  return res;
}

export async function getOneUserInTest({ userId, testId }) {
  const res = await api({
    method: 'GET',
    url: `/test/get-user-in-test?userId=${userId}&testId=${testId}`,
  });
  return res;
}

export async function joinPublicTest(data) {
  const res = await api({
    method: 'POST',
    url: '/test/join-public-test',
    data: data,
  });
  return res;
}

export async function getUserInTestById(userInTestId) {
  const res = await api({
    method: 'GET',
    url: `/user-in-test/${userInTestId}`,
  });
  return res;
}

export async function getAudioInTestById(audioInTestId) {
  const res = await api({
    method: 'GET',
    url: `/audio-in-test/${audioInTestId}`,
  });
  return res;
}

export async function updateEvaluatingAudioInMOSTest(data) {
  const res = await api({
    method: 'PATCH',
    url: '/audio-in-test/MOS/evaluate',
    data: data,
  });
  return res;
}

export async function getAudiosInTest(testId) {
  const res = await api({
    method: 'GET',
    url: `/test/audios-in-test/${testId}`,
  });
  return res;
}

export async function getAllUsersInTestDetail(testId) {
  const res = await api({
    method: 'GET',
    url: `/test/users-in-test/detail/${testId}`,
  });
  return res;
}

export async function submitReport(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/submit-report',
    data: data,
  });
  return res;
}

export async function getTestForTeam(teamId) {
  const res = await api({
    method: 'GET',
    url: `/test/tests-for-team/${teamId}`,
  });
  return res;
}

export async function getAllAudiosInTestOfTeam({ teamId, testId }) {
  const res = await api({
    method: 'GET',
    url: `/test/audios-in-test-of-team?teamId=${teamId}&testId=${testId}`,
  });
  return res;
}
