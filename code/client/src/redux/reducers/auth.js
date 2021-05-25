import types from '../../constants/types';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: true,
};

export const authReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOADED_USER:
      return {
        token: payload.token,
        user: payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case types.LOADED_USER_FAILED:
      return {
        ...state,
        loading: false,
      };
    case types.LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        user: payload.user,
        token: payload.token,
        loading: false,
        isAuthenticated: true,
      };
    case types.LOGOUT:
      localStorage.removeItem('token');
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    case types.UPDATE_USER:
      // console.log('at redux', action);
      return {
        ...state,
        user: payload.user,
      };
    default:
      return state;
  }
};

export default authReducer;
