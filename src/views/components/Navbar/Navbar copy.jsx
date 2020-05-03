import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";

import "./Navbar.css";
import ButtonUI from "../Button/Button.tsx";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { logoutHandler } from "../../../redux/actions";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    showDropdownMenu: false,
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  dropdownMenu = () => {
    this.setState({ showDropdownMenu: !this.state.showDropdownMenu });
  };

  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div
          style={{ flex: 1 }}
          className="px-5 d-flex flex-row justify-content-start"
        >
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
            }`}
            type="text"
            placeholder="Cari produk impianmu disini"
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                isOpen={this.state.showDropdownMenu}
                toggle={this.dropdownMenu}
              >
                <DropdownToggle
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    backgroundColor: "inherit",
                    border: "inherit",
                  }}
                >
                  <div className="d-flex">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                    <p className="small ml-3 mr-4">
                      {this.props.user.username}
                    </p>
                  </div>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <Link
                      to="/admin/dashboard"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Dashboard
                    </Link>
                  </DropdownItem>
                  <DropdownItem onClick={this.props.onLogout}>
                    <Link
                      to="/"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Logout
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Link
                className="d-flex"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <>
                  <FontAwesomeIcon
                    className="mr-2"
                    icon={faShoppingCart}
                    style={{ fontSize: 24 }}
                  />
                  <CircleBg>
                    <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                      4
                    </small>
                  </CircleBg>
                </>
              </Link>
            </>
          ) : (
            <>
              <ButtonUI className="mr-3" type="textual">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign in
                </Link>
              </ButtonUI>
              <ButtonUI type="contained">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/auth"
                >
                  Sign up
                </Link>
              </ButtonUI>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onLogout: logoutHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
