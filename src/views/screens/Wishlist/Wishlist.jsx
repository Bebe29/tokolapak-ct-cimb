import React from "react";
import "./Wishlist.css";
import { connect } from "react-redux";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";
import { inCart } from "../../../redux/actions";

class Wishlist extends React.Component {
  state = {
    wishlistId: 0,
    wishlistData: [],
    productId: 0,
    cartData: [],
  };

  componentDidMount() {
    this.getWishlist();
  }

  getWishlist = () => {
    Axios.get(`${API_URL}/wishlists`, {
      params: {
        userId: this.props.user.id,
      },
    })
      .then((res) => {
        this.setState({ wishlistId: res.data[0].id });
        Axios.get(`${API_URL}/wishlistDetails`, {
          params: {
            wishlistId: this.state.wishlistId,
            _expand: "product",
          },
        })
          .then((res) => {
            // console.log(res.data);
            this.setState({ wishlistData: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  addToCartHandler = (productId) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        productId: productId,
      },
    })
      .then((res) => {
        // console.log(res.data);
        const { id, qtyInCart } = this.props.user;
        this.setState({ cartData: res.data[0] });
        if (res.data.length > 0) {
          const { quantity } = this.state.cartData;
          Axios.patch(`${API_URL}/carts/${this.state.cartData.id}`, {
            quantity: quantity + 1,
          })
            .then((res) => {
              this.props.inCart(id, qtyInCart + 1);
              swal(
                "Add to cart",
                "Your item has been added to your cart",
                "success"
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          Axios.post(`${API_URL}/carts`, {
            userId: this.props.user.id,
            productId: productId,
            quantity: 1,
          })
            .then((res) => {
              this.props.inCart(id, qtyInCart + 1);
              swal(
                "Add to cart",
                "Your item has been added to your cart",
                "success"
              );
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteWishlistHandler = (id) => {
    Axios.delete(`${API_URL}/wishlistDetails/${id}`)
      .then((res) => {
        this.getWishlist();
      })
      .catch((err) => {
        console.log(err);
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

  renderWishlist = () => {
    return this.state.wishlistData.map((val) => {
      const { product, id, productId } = val;
      const { productName, image, price, category, desc } = product;
      return (
        <tr style={{ border: "1px solid #dbdde0" }}>
          <td>
            <div className="d-flex justify-content-around align-items-center">
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
                  <span style={{ fontWeight: "normal" }}> {category}</span>
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
                <h6>
                  Description:
                  <span style={{ fontWeight: "normal" }}> {desc}</span>
                </h6>
              </div>
              <div className="d-flex flex-column align-items-center">
                <ButtonUI
                  onClick={(_) => this.addToCartHandler(productId)}
                  type="contained"
                >
                  Add to Cart
                </ButtonUI>
                <ButtonUI
                  className="mt-3"
                  type="textual"
                  onClick={() => this.deleteWishlistHandler(id)}
                >
                  Delete
                </ButtonUI>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container py-4">
        <div className="wishlist">
          <caption className="p-3">
            <h2>Wishlist</h2>
          </caption>
        </div>
        <table className="wishlist-table">{this.renderWishlist()}</table>
        {/* <div>{this.renderWishlist()}</div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
