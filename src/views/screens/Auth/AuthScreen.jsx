import React from "react";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { loginHandler, registerHandler } from "../../../redux/actions";
import { connect } from "react-redux";
import "./AuthScreen.css";

class AuthScreen extends React.Component {
  state = {
    activePage: "register",
    loginForm: {
      username: "",
      password: "",
      showPassword: false
    },
    registerForm: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      showPassword: false
    }
  };

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value
      }
    });
  };

  renderAuthComponent = () => {
    const { activePage } = this.state;
    if (activePage == "login") {
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
            value={this.state.loginForm.username}
            placeholder="Username"
            className="mt-5"
            onChange={e => this.inputHandler(e, "username", "loginForm")}
          />
          <TextField
            value={this.state.loginForm.password}
            placeholder="Password"
            className="mt-3"
            onChange={e => this.inputHandler(e, "password", "loginForm")}
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
            value={this.state.registerForm.username}
            placeholder="Username"
            className="mt-5"
            onChange={e => this.inputHandler(e, "username", "registerForm")}
          />
          <TextField
            value={this.state.registerForm.fullName}
            placeholder="Name"
            className="mt-3"
            onChange={e => this.inputHandler(e, "fullName", "registerForm")}
          />
          <TextField
            value={this.state.registerForm.email}
            placeholder="Email"
            className="mt-3"
            onChange={e => this.inputHandler(e, "email", "registerForm")}
          />
          <TextField
            value={this.state.registerForm.password}
            placeholder="Password"
            className="mt-3"
            onChange={e => this.inputHandler(e, "password", "registerForm")}
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

  login = () => {
    const { username, password } = this.state;
    const userData = {
      username,
      password
    };
    this.props.onLogin(userData);
  };

  register = () => {
    const { username, fullName, email, password } = this.state.registerForm;
    const newUser = { username, fullName, email, password };
    this.props.onRegister(newUser);
  };

  render() {
    const { isLogin } = this.state;
    return (
      <div className="container">
        <div className="d-flex mt-5">
          <ButtonUI
            type="outlined"
            className={`auth-screen-btn ${
              this.state.activePage == "register" ? "active" : null
            } mr-4`}
            onClick={() => this.setState({ activePage: "register" })}
          >
            Register
          </ButtonUI>
          <ButtonUI
            type="outlined"
            className={`auth-screen-btn ${
              this.state.activePage == "login" ? "active" : null
            }`}
            onClick={() => this.setState({ activePage: "login" })}
          >
            Login
          </ButtonUI>
        </div>
        <div className="row mt-5">
          <div className="col-5">{this.renderAuthComponent()}</div>
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
