export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toString().toLowerCase());
}

export function isInteger(str) {
  if (typeof str !== 'string') return false;
  const nums = str.split('.');
  if (nums.length > 1) return false;
  return !isNaN(str) && !isNaN(parseInt(str));
}
