import React from "react";
import { connect } from "react-redux";
import "./Payment.css";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class Payment extends React.Component {
  state = {
    paymentData: [],
    detailData: [],
    productList: [],
    statusOrder: "All",
     modalOpen: false,
  };

  componentDidMount() {
    this.getPaymentData();
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  getPaymentData = (condition) => {
    // console.log(condition);
    if (condition === "All") {
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

  detailBtnHandler = (idx) => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: this.state.paymentData[idx].id,
        _embed: "transactionDetails",
      },
    })
      .then((res) => {
        // console.log(res.data[0].transactionDetails);
        this.setState({
          detailData: res.data[0],
          productList: res.data[0].transactionDetails,
          modalOpen: true,
        });
        // console.log(this.state.detailData)
        // console.log(this.state.productList)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderPaymentData = () => {
    return this.state.paymentData.map((val, idx) => {
      // console.log(val);
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
                onClick={() => this.detailBtnHandler(idx)}
              >
                Detail
              </ButtonUI>
            </td>
          </tr>
        </>
      );
    });
  };

  renderModalProduct = () => {
    return this.state.productList.map((val) => {
      // console.log(val);
      const { productId, quantity, total, price } = val;
      return (
        <tr>
          <td>{productId}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </td>
          <td>{quantity}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(total)}
          </td>
        </tr>
      );
    });
  };

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.setState({ statusOrder: value });
    this.getPaymentData(value)
  };

  renderProduct = (data) => {
  };

  render() {
    const {
      orderDate,
      paymentDate,
      finishDate,
      shipping,
      transactionDetails,
    } = this.state.detailData;
    return (
      <>
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
              <option value="All">All</option>
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
      <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Detail Transaction</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div>Order Date: {orderDate}</div>
            <div>Payment Date: {paymentDate}</div>
            <div>Finish Date: {finishDate}</div>
            <div>Shipping cost: {shipping}</div>
            <div>Product:</div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>{this.renderModalProduct()}</tbody>
              </table>
            </div>
            <div></div>
            <div>
              <ButtonUI
                className="w-100"
                onClick={this.toggleModal}
                type="outlined"
              >
                Close
              </ButtonUI>
            </div>
          </ModalBody>
        </Modal>
        </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Payment);
