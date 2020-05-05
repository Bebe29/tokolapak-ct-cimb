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
    transactionData: [],
    productList: [],
    price: [],
    reportType: "User",
    sum: 0,
  };

  componentDidMount() {
    this.getUserData();
    this.getSuccessData();
    this.getTransactionDetailData();
    this.getProductData();
    // this.countTotalPrice()
  }

  getUserData = () => {
    Axios.get(`${API_URL}/users`, {
      params: {
        role: "User",
        _embed: "transactions",
      },
    })
      .then((res) => {
        this.setState({ userList: res.data });
        console.log(this.state.userList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSuccessData = () => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getTransactionDetailData = () => {
    Axios.get(`${API_URL}/transactionDetails`, {
      params: {
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ transactionData: res.data });
        console.log(this.state.transactionData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getProductData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ productList: res.data });
        console.log(this.state.productList);
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
        let totalBuy = 0;
        const { username, transactions, id } = val;
        if (transactions.length > 0) {
          this.state.successData.map((val) => {
            if (id == val.userId) {
              totalBuy += val.totalPrice;
            }
          });
          return (
            <tr>
              <td>{idx + 1}</td>
              <td>{username}</td>
              <td>{totalBuy}</td>
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
      return this.state.transactionData.map((val, idx) => {
        const { product, quantity } = val;
        // console.log(this.state.sum);

        return (
          <tr>
            <td>{idx + 1}</td>
            <td>{product.productName}</td>
            <td>{}</td>
            <td>{quantity}</td>
          </tr>
        );
      });
      // return (
      //   <tr>
      //     <td>No</td>
      //     <td>Product Name</td>
      //     <td>User Name</td>
      //     <td>Quantity</td>
      //   </tr>
      // );
    }
  };

  totalPrice = (id) => {
    // console.log(this.state.successData[0]);
    // if (id === this.state.successData[0].userId) {
    // }
    // Axios.get(`${API_URL}/transactions`, {
    //   params: {
    //     status: "Success",
    //     userId: id
    //   },
    // })
    //   .then((res) => {
    //     // console.log(res.data);
    //     this.setState({ successData: res.data });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

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
