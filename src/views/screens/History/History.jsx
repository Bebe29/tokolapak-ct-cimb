import React from "react";
import { connect } from "react-redux";
import "./History.css";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

class History extends React.Component {
  state = {
    historyData: [],
    detailData: [],
    productList: [],
    modalOpen: false,
  };

  componentDidMount() {
    this.getHistoryData();
  }

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  getHistoryData = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.user.id,
      },
    })
      .then((res) => {
        // console.log(res.data);
        this.setState({ historyData: res.data });
        // console.log(this.state.itemsData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  payBtnHandler = (idIndex) => {
    const now = new Date();
    const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: idIndex,
      },
    })
      .then((res) => {
        Axios.patch(`${API_URL}/transactions/${idIndex}`, {
          status: "On Progress",
          paymentDate: date,
        })
          .then((res) => {
            swal(
              "Success!",
              "Your payment success. Please wait for admin confirmation",
              "success",
              {
                button: { value: true },
              }
            ).then(() => {
              this.getHistoryData();
            });
          })
          .catch((err) => {
            swal(
              "Error!",
              "Sorry, your payment unsuccess. Please try again.",
              "error"
            );
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderHistoryData = () => {
    return this.state.historyData.map((val, idx) => {
      const {
        id,
        totalPrice,
        orderDate,
        paymentDate,
        finishDate,
        status,
        shipping,
      } = val;
      return (
        <>
          <tr>
            <td>{id}</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(totalPrice)}
            </td>
            <td>{status}</td>
            <td>
              {status === "Pending" ? (
                <ButtonUI
                  type="contained"
                  onClick={() => this.payBtnHandler(id)}
                >
                  Pay
                </ButtonUI>
              ) : (
                <ButtonUI type="disabled">Pay</ButtonUI>
              )}
              <ButtonUI
                type="textual"
                className="mt-3"
                onClick={() => this.renderDetail(idx)}
              >
                Detail
              </ButtonUI>
            </td>
          </tr>
        </>
      );
    });
  };

  renderDetail = (idx) => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: this.state.historyData[idx].id,
        _embed: "transactionDetails",
      },
    })
      .then((res) => {
        // console.log(res.data[0].transactionDetails);
        this.setState({
          detailData: res.data,
          productList: res.data[0].transactionDetails,
          modalOpen: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderModalProduct = () => {
    return this.state.productList.map((val) => {
      console.log(val);
      const { productID, quantity, total, price } = val;
      return (
        <tr>
          <td>{productID}</td>
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
          <div className="history">
            <caption className="p-3">
              <h2>History</h2>
            </caption>
            <table className="history-table">
              <thead>
                <tr>
                  <td>Purchased ID</td>
                  <td>Total Price</td>
                  <td>Status</td>
                  <td>Action</td>
                  {/* <td>No</td> */}
                  {/* <td>Purchased Item</td> */}
                </tr>
              </thead>
              <tbody>{this.renderHistoryData()}</tbody>
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

export default connect(mapStateToProps)(History);
