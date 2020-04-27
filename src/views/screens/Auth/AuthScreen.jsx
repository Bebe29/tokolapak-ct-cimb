import React from "react";
import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import { loginHandler } from "../../../redux/actions";
import { connect } from "react-redux";

class AuthScreen extends React.Component {
  login = () => {
    const { username, password } = this.state;
    const userData = {
      username,
      password
    };
    this.props.onLogin(userData);
  };

  render() {
    return (
      <div className="container">
        <div className="d-flex mt-5">
          <ButtonUI
            type="contained"
            className="mr-4"
            style={{ backgroundColor: "#373F41", borderColor: "#373F41" }}
          >
            Register
          </ButtonUI>
          <ButtonUI
            type="outlined"
            style={{ color: "#373F41", borderColor: "#373F41" }}
          >
            Login
          </ButtonUI>
        </div>
        <div className="row mt-5">
          <div className="col-5">
            <div>
              <h3>Log In</h3>
              <p className="mt-4">
                Welcome back.
                <br />
                Please, login to your account
              </p>
              <p>{this.props.user.errMsg}</p>
              <TextField placeholder="Username" className="mt-5" />
              <TextField placeholder="Password" className="mt-3" />

              <div className="d-flex justify-content-center">
                <ButtonUI
                  type="contained"
                  className="mt-5"
                  onClick={this.login}
                >
                  Login
                </ButtonUI>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-5">
            <div>
              <h3>Register</h3>
              <p className="mt-4 text-justify">
                You will get the best recommendation for rent house in near of
                you
              </p>
              <TextField placeholder="Name" className="mt-5" />
              <TextField placeholder="Email" className="mt-3" />
              <TextField placeholder="Password" className="mt-3" />
              <TextField placeholder="Confirm Password" className="mt-3" />

              <div className="d-flex justify-content-center">
                <ButtonUI type="contained" className="mt-5">
                  Register
                </ButtonUI>
              </div>
            </div>
          </div>
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
  onLogin: loginHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
// export default AuthScreen;
