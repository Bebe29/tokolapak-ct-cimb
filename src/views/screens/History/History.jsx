import React from "react";
import { connect } from "react-redux";
import "./History.css";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import swal from "sweetalert";

class History extends React.Component {
  state = {
    historyData: [],
  };

  componentDidMount() {
    this.getHistoryData();
  }

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
          status: "Waiting Verification",
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
      } = val;
      return (
        <tr>
          <td>{id}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalPrice)}
          </td>
          <td>{orderDate}</td>
          <td>{paymentDate}</td>
          <td>{finishDate}</td>
          <td>{status}</td>
          <td>
            {status === "Pending" ? (
              <ButtonUI type="contained" onClick={() => this.payBtnHandler(id)}>
                Pay
              </ButtonUI>
            ) : (
              <ButtonUI type="disabled">Pay</ButtonUI>
            )}
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
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
                <td>Order Date</td>
                <td>Payment Date</td>
                <td>Finish Date</td>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(History);
