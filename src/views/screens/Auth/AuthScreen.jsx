import React from "react";
import ReactDOM from "react-dom";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { loginHandler, registerHandler } from "../../../redux/actions";
import { connect } from "react-redux";

class AuthScreen extends React.Component {
  state = {
    username: "",
    password: "",
    repeatPass: "",
    fullName: "",
    role: "",
    isLogin: false
  };

  inputHandler = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  form = () => {
    const { isLogin } = this.state;
    if (isLogin) {
      return (
        <div>
          <h3>Log In</h3>
          <p className="mt-4">
            Welcome back.
            <br />
            Please, login to your account
          </p>
          <p className="mt-2">{this.props.user.errMsg}</p>
          <TextField
            placeholder="Username"
            className="mt-5"
            onChange={e => this.inputHandler(e, "username")}
          />
          <TextField
            placeholder="Password"
            className="mt-3"
            onChange={e => this.inputHandler(e, "password")}
          />
          <div className="d-flex justify-content-center">
            <ButtonUI type="contained" className="mt-5" onClick={this.login}>
              Login
            </ButtonUI>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Register</h3>
          <p className="mt-4 text-justify">
            You will get the best recommendation for rent house in near of you
          </p>
          <p className="mt-2">{this.props.user.errMsg}</p>
          <TextField
            placeholder="Username"
            className="mt-5"
            onChange={e => this.inputHandler(e, "username")}
          />
          <TextField
            placeholder="Full Name"
            className="mt-3"
            onChange={e => this.inputHandler(e, "fullName")}
          />
          <TextField
            placeholder="Role"
            className="mt-3"
            onChange={e => this.inputHandler(e, "role")}
          />
          <TextField
            placeholder="Password"
            className="mt-3"
            onChange={e => this.inputHandler(e, "password")}
          />
          <TextField
            placeholder="Confirm Password"
            className="mt-3"
            onChange={e => this.inputHandler(e, "repeatPass")}
          />
          <div className="d-flex justify-content-center">
            <ButtonUI type="contained" className="mt-5" onClick={this.register}>
              Register
            </ButtonUI>
          </div>
        </div>
      );
    }
  };

  loginScreen = () => {
    this.setState({ isLogin: true });
  };

  registerScreen = () => {
    this.setState({ isLogin: false });
  };

  login = () => {
    const { username, password } = this.state;
    const userData = {
      username,
      password
    };
    this.props.onLogin(userData);
    // this.setState({
    //   username: "",
    //   password: ""
    // });
  };

  register = () => {
    const { fullName, role, username, password, repeatPass } = this.state;
    const userData = { fullName, role, username, password, repeatPass };

    this.props.onRegister(userData);
    // this.setState({
    //   fullName: "",
    //   role: "",
    //   username: "",
    //   password: "",
    //   repeatPass: ""
    // });
  };

  render() {
    const { isLogin } = this.state;
    return (
      <div className="container">
        <div className="d-flex mt-5">
          <ButtonUI
            type="outlined"
            className="mr-4"
            onClick={this.registerScreen}
          >
            Register
          </ButtonUI>
          <ButtonUI type="outlined" onClick={this.loginScreen}>
            Login
          </ButtonUI>
        </div>
        <div className="row mt-5">
          <div className="col-5">{this.form()}</div>
          <div className="col-7">Picture</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  onLogin: loginHandler,
  onRegister: registerHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
