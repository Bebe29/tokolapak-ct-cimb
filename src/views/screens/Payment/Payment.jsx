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
    Axios.get(`${API_URL}/transactions`)
      .then((res) => {
        // console.log(res.data);
        this.setState({ paymentData: res.data });
        // console.log(this.state.itemsData);
      })
      .catch((err) => {
        console.log(err);
      });
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
      const { id, userId, totalPrice, status } = val;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{id}</td>
          <td>{userId}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalPrice)}
          </td>
          <td>{status}</td>
          <td>
            {status === "Waiting Verification" ? (
              <ButtonUI
                type="contained"
                onClick={() => this.verificationBtnHandler(id)}
              >
                Verification
              </ButtonUI>
            ) : (
              <ButtonUI type="disabled">Verification</ButtonUI>
            )}
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
                <td>No</td>
                <td>Payment ID</td>
                <td>User ID</td>
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
