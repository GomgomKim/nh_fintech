import { LOGIN, LOGOUT } from '../actions/loginAction';
import { reactLocalStorage } from 'reactjs-localstorage';
import con from '../const';

const loginInitialState = {
  isLogin: false,
  loginInfo: {
    createDate: '',
    idx: 0,
    ipAddress: '',
    mobile: '',
    name: '',
    password: '',
    superAdmin: 0,
    userId: '',
    authList: [],
    branch: null,
  },
};

const login = (state = loginInitialState, action) => {
  switch (action.type) {
    case LOGIN:
      reactLocalStorage.setObject(con + '#adminUser', action.loginInfo);
      console.log(Object.assign({}, state, {
        isLogin: true,
        loginInfo: action.loginInfo,
      }));
      return Object.assign({}, state, {
        isLogin: true,
        loginInfo: action.loginInfo,
      });
    case LOGOUT:
      reactLocalStorage.remove(con + '#adminUser');
      return Object.assign({}, state, {
        isLogin: false,
        loginInfo: {
          createDate: '',
          idx: 0,
          ipAddress: '',
          mobile: '',
          name: '',
          password: '',
          superAdmin: 0,
          userId: '',
          authList: [],
        },
      });
    default:
      return state;
  }
};

export default login;
