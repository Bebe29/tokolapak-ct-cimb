import userTypes from "../types/user";

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;
const init_state = {
  id: 0,
  username: "",
  fullName: "",
  role: "",
  errMsg: "",
  cookieChecked: false,
  searchProduct: "",
  qtyInCart: 0,
  signPage: "register",
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { username, fullName, role, id, qtyInCart } = action.payload;
      return {
        ...state,
        username,
        fullName,
        role,
        id,
        qtyInCart,
        cookieChecked: true,
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case ON_LOGOUT_SUCCESS:
      return {
        ...init_state,
        cookieChecked: true,
      };
    case "COOKIE_CHECK":
      return { ...state, cookieChecked: true };
    case "SEARCH_PRODUCT":
      return { ...state, cookieChecked: true, searchProduct: action.payload };
    case "IN_CART":
      return {
        ...state,
        cookieChecked: true,
        qtyInCart: action.payload,
      };
    case "SIGN_PAGE":
      return {
        ...state,
        cookieChecked: true,
        signPage: action.payload,
      };
    default:
      return { ...state };
  }
};
