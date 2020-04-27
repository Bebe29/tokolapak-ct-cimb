import userTypes from "../types/user";

<<<<<<< HEAD
const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;
=======
const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

>>>>>>> 6dba32738aaf227d6a159edcd2d87bf720b06f33
const init_state = {
  id: 0,
  username: "",
  fullName: "",
  address: {},
  role: "",
<<<<<<< HEAD
  errMsg: ""
=======
  errMsg: "",
>>>>>>> 6dba32738aaf227d6a159edcd2d87bf720b06f33
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username, fullName, role, id } = action.payload;
      return {
        ...state,
        username,
        fullName,
        role,
<<<<<<< HEAD
        id
=======
        id,
>>>>>>> 6dba32738aaf227d6a159edcd2d87bf720b06f33
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state };
    default:
      return { ...state };
  }
};
