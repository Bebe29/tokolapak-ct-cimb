import React, { Component } from "react";
import "./PageNotFound.css";

class PageNotFound extends Component {
  render() {
    return (
      <div
        className="d-flex justify-content-around align-items-center"
        style={{ height: "200px" }}
      >
        <div className="text-center">
          <h1>404</h1>
          <h2>Oops! Page not found!</h2>
        </div>
      </div>
    );
  }
}

export default PageNotFound;
