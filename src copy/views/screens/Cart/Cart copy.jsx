import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";

class Cart extends React.Component {
  state = {
    cartData: [],
  };

  componentDidMount() {
    this.getCartData();
  }

  getCartData = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteHandler = (cartID) => {
    Axios.delete(`${API_URL}/carts/${cartID}`)
      .then((res) => {
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{val.product.productName}</td>
          <td>
            <img
              src={val.product.image}
              alt=""
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
          </td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(val.product.price)}
          </td>
          <td>{val.quantity}</td>
          <td>
            <div className="d-flex justify-content-center">
              <ButtonUI
                type="outlined"
                onClick={() => this.deleteHandler(val.id)}
              >
                Delete Item
              </ButtonUI>
            </div>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container">
        <h3 className="text-center mt-3 mb-3">Cart</h3>
        {this.state.cartData.length > 0 ? (
          <Table responsive className="table text-center">
            <thead>
              <tr>
                <th>No</th>
                <th>Product Name</th>
                <th>Image</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.renderCartData()}</tbody>
          </Table>
        ) : (
          <Alert className="text-center">
            Your cart is empty!{" "}
            <Link to="/" style={{ textDecoration: "none" }}>
              Go shopping
            </Link>
          </Alert>
        )}
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
