import React from "react";
import { connect } from "react-redux";
import "./Payment.css";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";

class Payment extends React.Component {
  state = {
    paymentData: [],
    activeProducts: [],
    detailData: [],
    statusOrder: "",
  };

  componentDidMount() {
    this.getPaymentData();
  }

  getPaymentData = (condition) => {
    // console.log(this.state.statusOrder);
    if (condition === "") {
      Axios.get(`${API_URL}/transactions`, {
        params: {
          _expand: "user",
          _embed: "transactionDetails",
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.setState({ paymentData: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Axios.get(`${API_URL}/transactions`, {
        params: {
          status: condition,
          _expand: "user",
          _embed: "transactionDetails",
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.setState({ paymentData: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  verificationBtnHandler = (idIndex) => {
    const now = new Date();
    const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: idIndex,
      },
    })
      .then((res) => {
        // console.log(date);
        Axios.patch(`${API_URL}/transactions/${idIndex}`, {
          status: "Success",
          finishDate: date,
        })
          .then((res) => {
            swal("Success!", "Verification payment success", "success");
            this.getPaymentData();
          })
          .catch((err) => {
            swal(
              "Error!",
              "Sorry, verification payment unsuccess. Please try again.",
              "error"
            );
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderPaymentData = () => {
    return this.state.paymentData.map((val, idx) => {
      console.log(val);
      const {
        id,
        userId,
        totalPrice,
        status,
        orderDate,
        paymentDate,
        finishDate,
        transactionDetails,
        user,
      } = val;
      const { username } = user;
      return (
        <>
          <tr>
            <td>{idx + 1}</td>
            <td>{id}</td>
            <td>{username}</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(totalPrice)}
            </td>
            <td>{status}</td>
            <td>
              {status === "On Progress" ? (
                <ButtonUI
                  type="contained"
                  onClick={() => this.verificationBtnHandler(id)}
                >
                  Verification
                </ButtonUI>
              ) : (
                <ButtonUI type="disabled">Verification</ButtonUI>
              )}
              <ButtonUI
                type="outlined"
                // onClick={() => this.verificationBtnHandler(id)}
              >
                Detail
              </ButtonUI>
            </td>
          </tr>
          {/* <tr>
            <td className="" colSpan={3}>
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex flex-column ml-4 justify-content-center">
                  <h6>
                    Order Date:
                    <span style={{ fontWeight: "normal" }}> {orderDate}</span>
                  </h6>
                  <h6>
                    Payment Date:
                    <span style={{ fontWeight: "normal" }}> {paymentDate}</span>
                  </h6>
                  <h6>
                    Finish Date:
                    <span style={{ fontWeight: "normal" }}> {finishDate}</span>
                  </h6>
                  <h6>Product:</h6>
                  <div className="mr-5">
                      <img
                      src={image}
                      alt=""
                      style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "contain",
                        }}
                        />
                        </div>
                    <div className="mr-5">
                      <h5>{productName}</h5>
                      <h6 className="mt-2">
                      Category:
                        <span style={{ fontWeight: "normal" }}>
                          {" "}
                          {category}
                        </span>
                        </h6>
                      <h6>
                        Price:
                        <span style={{ fontWeight: "normal" }}>
                        {" "}
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(price)}
                          </span>
                          </h6>
                        </div>
                  <>{this.renderProduct(transactionDetails)}</>
                </div>
              </div>
            </td>
          </tr> */}
        </>
      );
    });
  };

  getProductDetail = () => {
    Axios.get(`${API_URL}/transactionDetails`, {
      params: {
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ detailData: res.data });
        console.log(this.state.detailData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.getPaymentData(value);
  };

  renderProduct = (data) => {
    // this.getProductDetail();
  };

  render() {
    return (
      <div className="container py-4">
        <div className="payment">
          <caption className="p-3">
            <h2>Payment</h2>
          </caption>
          <div className="col-6 pb-3">
            <select
              value={this.state.statusOrder}
              className="custom-text-input h-100 pl-3"
              onChange={(e) => this.inputHandler(e, "statusOrder")}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="On Progress">On Progress</option>
              <option value="Success">Success</option>
            </select>
          </div>
          <table className="payment-table">
            <thead>
              <tr>
                <td>No</td>
                <td>Payment ID</td>
                <td>User Name</td>
                <td>Total</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>{this.renderPaymentData()}</tbody>
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

export default connect(mapStateToProps)(Payment);
