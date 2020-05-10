import React from "react";
import { Link } from "react-router-dom";

class PageNotFound extends React.Component {
  render() {
    return (
      <div className="container text-center">
        <h1>Oops.. 404 Page Not Found</h1>
        <Link to="/">Back to home</Link>
      </div>
    );
  }
}

export default PageNotFound;
