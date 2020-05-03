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
  };

  componentDidMount() {
    this.getPaymentData();
  }

  getPaymentData = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.user.id,
      },
    })
      .then((res) => {
        // console.log(res.data);
        this.setState({ paymentData: res.data });
        // console.log(this.state.itemsData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  payBtnHandler = (idIndex) => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        id: idIndex,
      },
    })
      .then((res) => {
        Axios.patch(`${API_URL}/transactions/${idIndex}`, {
          status: "Success",
        })
          .then((res) => {
            swal("Success!", "Your payment success", "success", {
              button: { value: true },
            }).then(() => {
              this.getPaymentData();
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

  renderPaymentData = () => {
    return this.state.paymentData.map((val, idx) => {
      const { id, totalPrice, status } = val;
      //   const { productName, image, price } = product;
      return (
        <tr>
          {/* <td>{idx + 1}</td> */}
          <td>{id}</td>
          {/* <td>{}</td> */}
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalPrice)}
          </td>
          <td>{status}</td>
          <td>
            <ButtonUI type="contained" onClick={() => this.payBtnHandler(id)}>
              Pay
            </ButtonUI>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <div className="container py-4">
        <div className="payment">
          <caption className="p-3">
            <h2>Payment</h2>
          </caption>
          <table className="payment-table">
            <thead>
              <tr>
                {/* <td>No</td> */}
                <td>Payment ID</td>
                {/* <td>Purchased Item</td> */}
                <td>Total Price</td>
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
