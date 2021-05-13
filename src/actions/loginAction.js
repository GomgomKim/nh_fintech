export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const CHANGE_BRANCH = 'CHANGE_BRANCH'

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

export function changeBranch(value) {
  return {
    type: CHANGE_BRANCH,
    value:value,
  };
}
