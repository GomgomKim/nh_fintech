export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function login(loginInfo) {
  return {
    type: LOGIN,
    loginInfo: loginInfo,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
