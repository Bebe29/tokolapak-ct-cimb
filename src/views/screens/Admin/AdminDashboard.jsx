import React from "react";
import { Table } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class AdminDashboard extends React.Component {
  state = {
    productData: [],
    createForm: {
      productName: "",
      price: 0,
      category: "Phone",
      image: "",
      desc: ""
    },
    editForm: {
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: ""
    }
  };

  getProductList = () => {
    Axios.get(`${API_URL}/products`)
      .then(res => {
        this.setState({ productData: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getProductList();
  }

  renderProductList = () => {
    return this.state.productData.map((val, idx) => {
      const { id, productName, price, category, image, desc } = val;
      return (
        <tr>
          <td>{id}</td>
          <td>{productName}</td>
          <td>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR"
            }).format(price)}
          </td>
          <td>{category}</td>
          <td>
            <img
              src={image}
              alt=""
              style={{ width: "80px", height: "80px", objectFit: "contain" }}
            />
          </td>
          <td>{desc}</td>
          <td>
            <ButtonUI type="contained" onClick={() => this.editBtnHandler(idx)}>
              Edit
            </ButtonUI>
          </td>
          <td>
            <ButtonUI
              type="outlined"
              //   onClick={() => this.deleteHandler(val.id)}
            >
              Delete
            </ButtonUI>
          </td>
        </tr>
      );
    });
  };

  editBtnHandler = idx => {
    this.setState({
      editForm: {
        ...this.state.productData[idx]
      }
    });
  };

  editProductHandler = () => {
    Axios.put(
      `${API_URL}/products/${this.state.editForm.id}`,
      this.state.editForm
    )
      .then(res => {
        swal("Success!", "Your item has been edited", "success");
        this.getProductList();
      })
      .catch(err => {
        swal("Error!", "Your item could not be edited", "error");
      });
  };

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value
      }
    });
  };

  createProductHandler = () => {
    Axios.post(`${API_URL}/products`, this.state.createForm)
      .then(res => {
        swal("Success!", "Your item has been added to the list", "success");
        this.setState({
          createForm: {
            productName: "",
            price: 0,
            category: "Phone",
            image: "",
            desc: ""
          }
        });
        this.getProductList();
      })
      .catch(err => {
        swal("Error!", "Your item could not be added to the list", "error");
      });
  };

  render() {
    return (
      <div className="container py-4">
        <h3 className="text-center mb-3">Admin Dashboard</h3>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Description</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>{this.renderProductList()}</tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <TextField
                  value={this.state.createForm.productName}
                  onChange={e =>
                    this.inputHandler(e, "productName", "createForm")
                  }
                  placeholder="Name"
                />
              </td>
              <td>
                <TextField
                  value={this.state.createForm.price}
                  onChange={e => this.inputHandler(e, "price", "createForm")}
                  placeholder="Price"
                />
              </td>
              <td colSpan={2}>
                <select
                  value={this.state.createForm.category}
                  onChange={e => this.inputHandler(e, "category", "createForm")}
                  className="form-control"
                >
                  <option value="Phone">Phone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tab">Tab</option>
                  <option value="Desktop">Desktop</option>
                </select>
              </td>
              <td>
                <TextField
                  value={this.state.createForm.image}
                  onChange={e => this.inputHandler(e, "image", "createForm")}
                  placeholder="Image"
                />
              </td>
              <td colSpan={2}>
                <TextField
                  value={this.state.createForm.desc}
                  onChange={e => this.inputHandler(e, "desc", "createForm")}
                  placeholder="Description"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={7}></td>
              <td>
                <ButtonUI type="contained" onClick={this.createProductHandler}>
                  Create
                </ButtonUI>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <TextField
                  value={this.state.editForm.productName}
                  onChange={e =>
                    this.inputHandler(e, "productName", "editForm")
                  }
                  placeholder="Name"
                />
              </td>
              <td>
                <TextField
                  value={this.state.editForm.price}
                  onChange={e => this.inputHandler(e, "price", "editForm")}
                  placeholder="Price"
                />
              </td>
              <td colSpan={2}>
                <select
                  onChange={e => this.inputHandler(e, "category", "editForm")}
                  className="form-control"
                >
                  <option value="Phone">Phone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Tab">Tab</option>
                  <option value="Desktop">Desktop</option>
                </select>
              </td>
              <td>
                <TextField
                  value={this.state.editForm.image}
                  onChange={e => this.inputHandler(e, "image", "editForm")}
                  placeholder="Image"
                />
              </td>
              <td colSpan={2}>
                <TextField
                  value={this.state.editForm.desc}
                  onChange={e => this.inputHandler(e, "desc", "editForm")}
                  placeholder="Description"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={7}></td>
              <td>
                <ButtonUI type="contained" onClick={this.editProductHandler}>
                  Save
                </ButtonUI>
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  }
}

export default AdminDashboard;
