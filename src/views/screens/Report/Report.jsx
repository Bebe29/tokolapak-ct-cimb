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
    userList: [],
    successData: [],
    productList: [],
    price: {},
    reportType: "User",
    sum: 0,
  };

  componentDidMount() {
    this.getReportData();
    // this.countTotalPrice()
  }

  getReportData = () => {
    Axios.get(`${API_URL}/users`, {
      params: {
        role: "User",
        _embed: "transactions",
      },
    })
      .then((res) => {
        this.setState({ userList: res.data });
        console.log(this.state.userList);
        Axios.get(`${API_URL}/transactions`, {
          params: {
            status: "Success",
            _expand: "User",
            _embed: "transactionDetails",
          },
        })
          .then((res) => {
            this.setState({ successData: res.data });
            console.log(this.state.successData);
            Axios.get(`${API_URL}/transactionDetails`, {
              params: {
                _expand: "product",
              },
            })
              .then((res) => {
                this.setState({ productList: res.data });
                console.log(this.state.productList);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
    } else if (this.state.reportType === "Product") {
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
      return this.state.userList.map((val, idx) => {
        const { username, transactions, id } = val;
        if (transactions.length > 0) {
          // console.log(this.state.sum);
          return (
            <tr>
              <td>{idx + 1}</td>
              <td>{username}</td>
              <td>{this.totalPrice(id)}</td>
            </tr>
          );
        } else {
          return (
            <tr>
              <td>{idx + 1}</td>
              <td>{username}</td>
              <td>{0}</td>
            </tr>
          );
        }
      });
    } else if (this.state.reportType === "Product") {
    }
  };

 totalPrice = (id) => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        status: "Success",
        userId: id
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // count = () => {
  //   this.state.price.map(val => {
  //     console.log(val)
  //   })
  // }

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.setState({ reportType: value });
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
