import api from '../api';

export async function signup(name, email, password, job) {
  const res = await api({
    method: 'POST',
    url: '/auths/signup',
    data: { name, email, password, job },
  });
  return res;
}

export async function login(data) {
  const res = await api({
    method: 'POST',
    url: '/auths/login',
    data: data,
  });
  return res;
}

export async function verifyToken() {
  const res = await api({
    method: 'GET',
    url: '/auths/verify',
  });
  return res;
}

export async function changePassword(password, newPassword) {
  const res = await api({
    method: 'PATCH',
    url: '/auths/change-password',
    data: { password, newPassword },
  });
  return res;
}
