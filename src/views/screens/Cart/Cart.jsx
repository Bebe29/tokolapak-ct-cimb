import React from "react";
import "./Cart.css";

import { connect } from "react-redux";
import { Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";

import Axios from "axios";
import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

class Cart extends React.Component {
  state = {
    cartData: [],
    paymentData: [],
    itemPurchased: [],
    idTransaction: 0,
    total: 0,
    modalOpen: false,
  };

  getCartData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data });
        this.countTotalPay();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getPaymentData = () => {
    this.setState({
      paymentData: this.state.cartData,
    });
  };

  renderCartData = (condition, data) => {
    return data.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price } = product;
      if (condition === "cart") {
        return (
          <tr>
            <td>{idx + 1}</td>
            <td>{productName}</td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}
            </td>
            <td>{quantity}</td>
            <td>
              {" "}
              <img
                src={image}
                alt=""
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />{" "}
            </td>
            <td>
              <ButtonUI
                type="outlined"
                onClick={() => this.deleteCartHandler(id)}
              >
                Delete Item
              </ButtonUI>
            </td>
          </tr>
        );
      } else {
        return (
          <tr>
            <td>{idx + 1}</td>
            <td>
              {" "}
              <img
                src={image}
                alt=""
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "contain",
                }}
              />{" "}
            </td>
            <td>{productName}</td>
            <td style={{ objectFit: "contain" }}>
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
              }).format(price * quantity)}
            </td>
          </tr>
        );
      }
    });
  };

  countTotalPay = () => {
    this.state.cartData.map((val) => {
      const { quantity, product, id } = val;
      const { price } = product;
      const sum = quantity * price;
      const item = { id, quantity, product };
      this.setState({
        total: this.state.total + sum,
        itemPurchased: [...this.state.itemPurchased, item],
      });
    });
  };

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/carts/${id}`)
      .then((res) => {
        this.getCartData();
        this.setState({
          totalPrice: 0,
          itemPurchased: [],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  clearCartHandler = (data) => {
    data.map((val) => {
      const { id } = val;
      this.deleteCartHandler(id);
    });
  };

  checkoutBtnHandler = () => {
    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.user.id,
      totalPrice: this.state.total,
      status: "Pending",
      item: this.state.itemPurchased,
    })
      .then((res) => {
        this.getPaymentData();
        this.setState({ idTransaction: res.data.id });
        this.toggleModal();
        this.clearCartHandler(res.data.item);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  payBtnHandler = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: this.state.idTransaction,
      },
    })
      .then((res) => {
        Axios.patch(`${API_URL}/transactions/${this.state.idTransaction}`, {
          status: "Success",
        })
          .then((res) => {
            swal("Success!", "Your payment success", "success", {
              button: { value: true },
            }).then(() => {
              this.toggleModal();
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

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getCartData();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="cart">
          <caption className="p-3">
            <h2>Cart Items</h2>
          </caption>
          {this.state.cartData.length > 0 ? (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCartData("cart", this.state.cartData)}</tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-right">
                    Total
                  </td>
                  <td colSpan={3}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(this.state.total)}
                  </td>
                  <td>
                    <ButtonUI
                      type="contained"
                      onClick={this.checkoutBtnHandler}
                    >
                      Checkout
                    </ButtonUI>
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="container cart-alert">
              <Alert>
                Your cart is empty! <Link to="/">Go shopping</Link>
              </Alert>
            </div>
          )}
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Payment</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            {/* <div className="payment">
              <caption className="p-3">
                <h5>Address</h5>
              </caption>
            </div> */}
            <div className="checkout">
              <caption className="p-3">
                <h5>Items</h5>
              </caption>
              <table className="checkout-table">
                <thead>
                  <tr>
                    <td>No</td>
                    <td>Image</td>
                    <td style={{ width: "4%" }}>Product Name</td>
                    <td>Price</td>
                    <td>Qty</td>
                    <td>Total</td>
                  </tr>
                </thead>
                <tbody>
                  {this.renderCartData("payment", this.state.paymentData)}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className="text-right">
                      Total
                    </td>
                    <td colSpan={1} className="text-left">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(this.state.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="row">
              <div className="col-5 mt-3 offset-1 d-flex justify-content-center">
                <ButtonUI
                  className="w-50"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  <Link
                    to="/payment"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Cancel
                  </Link>
                </ButtonUI>
              </div>
              <div className="col-5 mt-3 d-flex justify-content-center">
                <ButtonUI
                  className="w-50"
                  type="contained"
                  onClick={this.payBtnHandler}
                >
                  {/* <Link
                    to="/payment"
                    style={{ textDecoration: "none", color: "inherit" }}
                  > */}
                  Pay
                  {/* </Link> */}
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Cart);
