import api from '../api';

export async function getAllUserExceptAdmin() {
  const res = await api({
    method: 'GET',
    url: `/admin/all-users`,
  });
  return res;
}

export async function lockUser(data) {
  const res = await api({
    method: 'PATCH',
    url: '/admin/lock-user',
    data: data,
  });
  return res;
}

export async function unlockUser(data) {
  const res = await api({
    method: 'PATCH',
    url: '/admin/unlock-user',
    data: data,
  });
  return res;
}

export async function createUser(data) {
  const res = await api({
    method: 'POST',
    url: '/admin/create-user',
    data: data,
  });
  return res;
}
