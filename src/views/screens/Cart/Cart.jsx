import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import Axios from "axios";
import { API_URL } from "../../../constants/API";

class Cart extends React.Component {
  state = {
    cartList: []
  };

  componentDidMount() {
    // console.log(this.props.user.id);
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product"
      }
    })
      .then(res => {
        // console.log(res.data);
        this.setState({ cartList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteHandler = (idx, cartID) => {
    const { cartList } = this.state;
    let temp = [...cartList];
    temp.splice(idx, 1);
    this.setState({ cartList: temp });
    Axios.delete(`${API_URL}/carts/${cartID}`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderCartData = () => {
    const { cartList } = this.state;
    return cartList.map((val, idx) => {
      return (
        <tr>
          {/* <td>{val.id}</td> */}
          <td>{idx + 1}</td>
          <td>{val.product.productName}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR"
            }).format(val.product.price)}
          </td>
          <td>{val.quantity}</td>
          <td>
            <input
              type="button"
              value="Delete"
              className="btn btn-danger"
              onClick={() => this.deleteHandler(idx, val.id)}
            />
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container">
        <h3 className="text-center mt-3">Cart</h3>
        <table className="table mt-3 container text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.renderCartData()}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Cart);
