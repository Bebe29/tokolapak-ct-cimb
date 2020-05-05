import React from "react";
import "./Cart.css";

import { connect } from "react-redux";
import { Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Link } from "react-router-dom";

import Axios from "axios";
import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";

import { inCart } from "../../../redux/actions";

class Cart extends React.Component {
  state = {
    cartData: [],
    paymentData: [],
    total: 0,
    totalData: {
      subTotal: 0,
      ship: 0,
      totalPay: 0,
    },
    idTransaction: 0,
    modalOpen: false,
    shipping: 100000,
    // checkoutItems: [],
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
      totalData: {
        subTotal: this.state.total,
        ship: this.state.shipping,
        totalPay: this.state.total + this.state.shipping,
      },
    });
    console.log(this.state.totalData);
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
                onClick={() => this.deleteCartHandler(id, idx, "Item")}
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
      const { quantity, product } = val;
      const { price } = product;
      const sum = quantity * price;
      this.setState({
        total: this.state.total + sum,
      });
    });
  };

  deleteCartHandler = (idCart, idx, condition) => {
    const { id, qtyInCart } = this.props.user;
    if (condition === "Item") {
      this.props.inCart(id, qtyInCart - this.state.cartData[idx].quantity);
    } else {
      this.props.inCart(id, 0);
    }
    Axios.delete(`${API_URL}/carts/${idCart}`)
      .then((res) => {
        this.getCartData();
        this.setState({
          total: 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  clearCartHandler = () => {
    this.state.paymentData.map((val, idx) => {
      const { id } = val;
      this.deleteCartHandler(id, idx);
    });
  };

  checkoutBtnHandler = () => {
    const now = new Date();
    const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.user.id,
      totalPrice: this.state.total + this.state.shipping,
      status: "Pending",
      orderDate: date,
      paymentDate: "-",
      finishDate: "-",
      shipping: this.state.shipping,
    })
      .then((res) => {
        this.setState({ idTransaction: res.data.id });
        this.toggleModal();
        this.state.cartData.map((val) => {
          const { productId, product, quantity } = val;
          const { price } = product;
          Axios.post(`${API_URL}/transactionDetails`, {
            transactionId: res.data.id,
            productId: productId,
            price: price,
            quantity: quantity,
            total: price * quantity,
          })
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
        });
        this.getPaymentData();
        this.clearCartHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  payBtnHandler = () => {
    const now = new Date();
    const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: this.state.idTransaction,
      },
    })
      .then((res) => {
        Axios.patch(`${API_URL}/transactions/${this.state.idTransaction}`, {
          status: "On Progress",
          paymentDate: date,
        })
          .then((res) => {
            this.toggleModal();
            swal("Success!", "Your payment success", "success");
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

  inputHandler = (e, field) => {
    const { value } = e.target;
    this.setState({
      [field]: parseInt(value),
    });
  };

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
                    SubTotal
                  </td>
                  <td colSpan={4}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(this.state.total)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-right">
                    Shipping Method
                  </td>
                  <td colSpan={4}>
                    <div className="col-6">
                      <select
                        value={this.state.shipping}
                        className="custom-text-input h-100 pl-3"
                        onChange={(e) => this.inputHandler(e, "shipping")}
                      >
                        <option value="100000">Instant</option>
                        <option value="50000">Same Day</option>
                        <option value="20000">Express</option>
                        <option value="0">Economy</option>
                      </select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-right">
                    Shipping Cost
                  </td>
                  <td colSpan={4}>
                    {this.state.shipping === 0
                      ? "FREE"
                      : new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(this.state.shipping)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="text-right">
                    Total
                  </td>
                  <td colSpan={3}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(this.state.total + this.state.shipping)}
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
                      SubTotal
                    </td>
                    <td colSpan={1} className="text-left">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(this.state.totalData.subTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="text-right">
                      Shipping
                    </td>
                    <td colSpan={1} className="text-left">
                      {this.state.totalData.ship === 0
                        ? "FREE"
                        : new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(this.state.totalData.ship)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="text-right">
                      Total
                    </td>
                    <td colSpan={1} className="text-left">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(this.state.totalData.totalPay)}
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
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Pay Later
                  </Link>
                </ButtonUI>
              </div>
              <div className="col-5 mt-3 d-flex justify-content-center">
                <ButtonUI
                  className="w-50"
                  type="contained"
                  onClick={this.payBtnHandler}
                >
                  Pay Now
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

const mapDispatchToProps = {
  inCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
