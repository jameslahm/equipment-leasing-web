const NOT_FOUND_MESSAGE = "Sorry, not found";
const UNAUTHORIZED_MESSAGE =
  "Sorry, your credential has been expired, please login again";
const LOGIN_FAIL_MESSAGE = "Sorry, your username or password is not correct";
const LOGIN_SUCCCESS_MESSAGE = "Login Success";
const REGISTER_SUCCESS_MESSAGE = "Register Success";
const REGISTER_FAIL_MESSAGE = "Register Error";
const DEFAULT_ERROR_MESSAGE =
  "Some error happend, please check your network and refresh";

export function generateMessage(err, path) {
  console.log(err,path)
  if (err) {
    switch (err.status) {
      case 404: {
        return NOT_FOUND_MESSAGE;
      }
      case 401: {
        if(path==='/login'){
          return LOGIN_FAIL_MESSAGE
        }
        return UNAUTHORIZED_MESSAGE;
      }
      case 400: {
        if (path === "/login") {
          return LOGIN_FAIL_MESSAGE;
        }
        if (path==='/register'){
          return REGISTER_FAIL_MESSAGE;
        }
        return DEFAULT_ERROR_MESSAGE;
      }
      default: {
        return DEFAULT_ERROR_MESSAGE;
      }
    }
  }
  switch (path) {
    case "/login": {
      return LOGIN_SUCCCESS_MESSAGE;
    }
    case "/register": {
      return REGISTER_SUCCESS_MESSAGE;
    }
    default: {
      return "Update Success";
    }
  }
}
