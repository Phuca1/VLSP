import api from '../api';
import apiInfinite from '../apiInfinite';

export async function createCompetition(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/create',
    data: data,
  });
  return res;
}

export async function updateCompetition(data) {
  const res = await api({
    method: 'PATCH',
    url: '/competition/update',
    data: data,
  });
  return res;
}

export async function createTaskVerifyData(data) {
  const res = await apiInfinite({
    method: 'POST',
    url: '/competition/create-verification-task',
    data: data,
    // headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res;
}

export async function getAudiosInOneCompetition(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/audios-in-one-competition/${competitionId}`,
  });
  return res;
}

export async function updateThreshold(data) {
  const res = await api({
    method: 'PATCH',
    url: '/competition/update-threshold',
    data: data,
  });
  return res;
}

export async function shareData(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/share-data',
    data: data,
  });
  return res;
}

export async function getDataTrainingById(dataTrainingId) {
  const res = await api({
    method: 'GET',
    url: `/competition/data-training/${dataTrainingId}`,
  });
  return res;
}

export async function getRequestTeam(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/requested-teams/${competitionId}`,
  });
  return res;
}

export async function confirmShareData(data) {
  const res = await api({
    method: 'PATCH',
    url: '/competition/confirm-share-data',
    data: data,
  });
  return res;
}

export async function createTaskSubmission(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/create-submission-task',
    data: data,
  });
  return res;
}

export async function updateTaskSubmission(data) {
  const res = await api({
    method: 'PATCH',
    url: '/competition/update-submission-task',
    data: data,
  });
  return res;
}

export async function getTeamsWhoSubmittedResult(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/get-team-submitted-result/${competitionId}`,
  });
  return res;
}

export async function getTestsInCompetition(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/test/get-test-in-competition/${competitionId}`,
  });
  return res;
}

export async function getUserDoNotJoinCompetition(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/users/not-join/${competitionId}`,
  });
  return res;
}

export async function createTest(data) {
  const res = await api({
    method: 'POST',
    url: '/test/create',
    data: data,
  });
  return res;
}

export async function notifyVerifyData(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/verify/notification-progress',
    data: data,
  });
  return res;
}

export async function createTestLatinSquare(data) {
  const res = await api({
    method: 'POST',
    url: '/test/create-latin-square',
    data: data,
  });
  return res;
}

export async function createTaskSubmitReport(data) {
  const res = await api({
    method: 'POST',
    url: '/competition/create/task-submit-report',
    data: data,
  });
  return res;
}

export async function getTeamsWhoSubmittedReport(competitionId) {
  const res = await api({
    method: 'GET',
    url: `/competition/get-team-submitted-report/${competitionId}`,
  });
  return res;
}

export async function sendResultToTeams(data) {
  const res = await api({
    method: 'POST',
    url: '/test/send-result',
    data: data,
  });
  return res;
}
