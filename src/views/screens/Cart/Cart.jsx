import React from "react";
import "./Cart.css";

import { Table, Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import Axios from "axios";
import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { priceFormatter } from "../../../supports/helpers/formatter";
import { fillCart } from "../../../redux/actions";

class Cart extends React.Component {
  state = {
    cartData: [],
    checkoutItems: [],
    shipping: "instant",
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

  checkboxHandler = (e, idx) => {
    const { checked } = e.target;

    if (checked) {
      this.setState({ checkoutItems: [...this.state.checkoutItems, idx] });
    } else {
      this.setState({
        checkoutItems: [
          ...this.state.checkoutItems.filter((val) => val !== idx),
        ],
      });
    }
  };

  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val;
      const { productName, image, price, category } = product;
      return (
        <tr
          style={{
            height: "150px",
          }}
        >
          <td className="text-left">
            <div className="d-flex align-items-center">
              <img
                className="mr-4"
                src={image}
                alt=""
                style={{
                  width: "100px",
                  height: "150px",
                  objectFit: "contain",
                }}
              />
              <div>
                <strong>{productName}</strong>
                <p>{category}</p>
              </div>
            </div>
          </td>
          <td style={{ verticalAlign: "middle" }}>
            <strong>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}
            </strong>
          </td>
          <td style={{ verticalAlign: "middle" }}>
            <strong>{quantity}</strong>
          </td>
          <td>
            <strong>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price * quantity)}
            </strong>
          </td>
          <td>
            <FontAwesomeIcon
              onClick={() => this.deleteCartHandler(id)}
              className="close-icon"
              icon={faTimesCircle}
              style={{ fontSize: "30px", color: "gray" }}
            />
          </td>
        </tr>
      );
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
        this.props.fillCart(this.props.user.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderSubTotalPrice = () => {
    let totalPrice = 0;

    this.state.cartData.forEach((val) => {
      const { quantity, product } = val;
      const { price } = product;

      totalPrice += quantity * price;
    });

    return totalPrice;
  };

  renderShippingPrice = () => {
    switch (this.state.shipping) {
      case "instant":
        return priceFormatter(100000);
      case "sameDay":
        return priceFormatter(50000);
      case "express":
        return priceFormatter(20000);
      default:
        return "Free";
    }
  };

  renderTotalPrice = () => {
    let totalPrice = 0;

    this.state.cartData.forEach((val) => {
      const { quantity, product } = val;
      const { price } = product;

      totalPrice += quantity * price;
    });

    let shippingPrice = 0;

    switch (this.state.shipping) {
      case "instant":
        shippingPrice = 100000;
        break;
      case "sameDay":
        shippingPrice = 50000;
        break;
      case "express":
        shippingPrice = 20000;
        break;
      default:
        shippingPrice = 0;
        break;
    }

    return totalPrice + shippingPrice;
  };

  checkoutHandler = () => {
    let date = new Date();
    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.user.id,
      totalPrice: this.renderTotalPrice(),
      status: "pending",
      checkoutDate: date.getTime(),
      completedDate: "",
    })
      .then((res) => {
        this.state.cartData.forEach((val) => {
          const { quantity, product } = val;
          const { price, id } = product;

          Axios.post(`${API_URL}/transactionDetails`, {
            transactionId: res.data.id,
            productId: id,
            price,
            quantity,
            totalPrice: price * quantity,
          })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log("ERROR POST TRANSACTION DETAILS");
            });
        });
      })
      .then((res) => {
        this.state.cartData.forEach((val) => {
          this.deleteCartHandler(val.id);
        });
      })
      .then((res) => {
        this.props.fillCart(this.props.user.id);
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
    if (this.state.cartData.length) {
      return (
        <div className="py-4" style={{ padding: "0px 240px" }}>
          <div className="row">
            <div className="col-8">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th className="text-left">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{this.renderCartData()}</tbody>
              </table>
            </div>
            <div className="col-4">
              <div className="cart-card">
                <div className="cart-card-head p-4">Order Summary</div>
                <div className="cart-card-body p-4">
                  <div className="d-flex justify-content-between my-2">
                    <div>Subtotal</div>
                    <strong>
                      {priceFormatter(this.renderSubTotalPrice())}
                    </strong>
                  </div>
                  <div className="d-flex justify-content-between my-2">
                    <div>Shipping</div>
                    <strong>{this.renderShippingPrice()}</strong>
                  </div>
                  <div className="d-flex justify-content-between my-2 align-items-center">
                    <label>Shipping Method</label>
                    <select
                      onChange={(e) =>
                        this.setState({ shipping: e.target.value })
                      }
                      className="form-control w-50"
                    >
                      <option value="instant">Instant</option>
                      <option value="sameDay">Same Day</option>
                      <option value="express">Express</option>
                      <option value="economy">Economy</option>
                    </select>
                  </div>
                </div>
                <div className="cart-card-foot p-4">
                  <div className="d-flex justify-content-between my-2">
                    <div>Total</div>
                    <div>{priceFormatter(this.renderTotalPrice())}</div>
                  </div>
                </div>
              </div>
              <input
                onClick={this.checkoutHandler}
                type="button"
                value="Checkout"
                className="btn btn-success btn-block mt-3"
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container py-4">
          <div className="row">
            <div className="col-12">
              <div className="alert alert-info">Shopping Cart Empty</div>
            </div>
          </div>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  fillCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
