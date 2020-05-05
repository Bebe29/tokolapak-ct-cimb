import React from "react";
import { connect } from "react-redux";
import "./Report.css";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";

class Report extends React.Component {
  state = {
    reportData: [],
    detailData: [],
    successData: [],
    reportType: "User",
    sum: 0,
  };

  componentDidMount() {
    this.getReportData();
  }

  getReportData = () => {
    if (this.state.reportType === "User") {
      Axios.get(`${API_URL}/users`, {
        params: {
          role: "User",
          _embed: "transactions",
        },
      })
        .then((res) => {
          this.setState({ reportData: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      //   Axios.get(`${API_URL}/transactions`, {
      //     params: {
      //       status: condition,
      //       _expand: "user",
      //       _embed: "transactionDetails",
      //     },
      //   })
      //     .then((res) => {
      //       // console.log(res.data);
      //       this.setState({ paymentData: res.data });
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    }
  };

  renderHeadData = () => {
    if (this.state.reportType === "User") {
      return (
        <tr>
          <td>No</td>
          <td>User Name</td>
          <td>Total Shopping</td>
        </tr>
      );
    } else if (this.state.reportType === "Admin") {
      return (
        <tr>
          <td>No</td>
          <td>Product Name</td>
          <td>User Name</td>
          <td>Quantity</td>
        </tr>
      );
    }
  };

  renderReportData = () => {
    if (this.state.reportType === "User") {
      return this.state.reportData.map((val, idx) => {
        // console.log(val);
        const { username, transactions, userId } = val;
        if (transactions.length > 0) {
          Axios.get(`${API_URL}/transactions`, {
            params: {
              userId: userId,
              status: "Success",
            },
          })
            .then((res) => {
              this.setState({ successData: res.data });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          return (
            <tr>
              <td>{idx + 1}</td>
              <td>{username}</td>
              <td>---</td>
            </tr>
          );
        }
      });
    } else if (this.state.reportType === "Admin") {
    }
  };

  renderSuccess = () => {
    return this.state.successData.map((val) => {
      console.log(val);
    });
    // data.map((val) => {
    //   console.log(val);
    //   const { status, totalPrice } = val;
    //   if (status === "Success") {
    //     return (
    //       <>
    //         <tr>
    //           <td>{idx + 1}</td>
    //           <td>{username}</td>
    //           <td>{totalPrice}</td>
    //         </tr>
    //       </>
    //     );
    //   }
    // });
  };

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.setState({ reportType: value });
    this.getReportData(value);
  };

  render() {
    return (
      <div className="container py-4">
        <div className="payment">
          <caption className="p-3">
            <h2>Report</h2>
          </caption>
          <div className="col-6 pb-3">
            <select
              value={this.state.reportType}
              className="custom-text-input h-100 pl-3"
              onChange={(e) => this.inputHandler(e, "reportType")}
            >
              <option value="User">User</option>
              <option value="Product">Product</option>
            </select>
          </div>
          <table className="payment-table">
            <thead>{this.renderHeadData()}</thead>
            <tbody>{this.renderReportData()}</tbody>
          </table>
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

export default connect(mapStateToProps)(Report);
