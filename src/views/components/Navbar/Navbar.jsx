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
import ButtonUI from "../Button/Button";
import { logoutHandler, searchProduct } from "../../../redux/actions";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searchBarInput: "",
    dropdownOpen: false,
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  logoutBtnHandler = () => {
    this.props.onLogout();
    // this.forceUpdate();
  };

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.setState({ [field]: value });
    this.props.searchProduct(value);
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
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
            value={this.state.searchBarInput}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={(e) => this.inputHandler(e, "searchBarInput")}
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
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                  {this.props.user.role === "admin" ? (
                    <>
                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/dashboard"
                        >
                          Dashboard
                        </Link>
                      </DropdownItem>
                      <DropdownItem>Members</DropdownItem>
                      <DropdownItem>
                        <Link
                          to="/payment"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          Payments
                        </Link>
                      </DropdownItem>
                      <DropdownItem onClick={this.logoutBtnHandler}>
                        <Link
                          to="/"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          Logout
                        </Link>
                      </DropdownItem>
                    </>
                  ) : (
                    <>
                      <DropdownItem>
                        <Link
                          to="/wishlist"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          Wishlist
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Link
                          to="/history"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          History
                        </Link>
                      </DropdownItem>
                      <DropdownItem onClick={this.logoutBtnHandler}>
                        <Link
                          to="/"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          Logout
                        </Link>
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
              <>
                {this.props.user.role === "user" ? (
                  <Link
                    className="d-flex flex-row"
                    to="/cart"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <FontAwesomeIcon
                      className="mr-2"
                      icon={faShoppingCart}
                      style={{ fontSize: 24 }}
                    />
                    <CircleBg>
                      <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                        {this.props.user.qtyInCart}
                      </small>
                    </CircleBg>
                  </Link>
                ) : null}
              </>
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
  searchProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
