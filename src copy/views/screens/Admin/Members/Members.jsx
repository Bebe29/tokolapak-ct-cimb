import React from "react";
import "./Members.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../../constants/API";

import ButtonUI from "../../../components/Button/Button";
import TextField from "../../../components/TextField/TextField";

import swal from "sweetalert";

class Members extends React.Component {
  state = {
    memberList: [],
    createForm: {
      username: "",
      fullName: "",
      password: "",
      email: "",
      role: "Admin",
      qtyInCart: 0,
    },
    editForm: {
      id: 0,
      username: "",
      fullName: "",
      password: "",
      email: "",
      role: "",
      qtyInCart: 0,
    },
    activeProducts: [],
    modalOpen: false,
  };

  getMemberList = () => {
    Axios.get(`${API_URL}/users`)
      .then((res) => {
        this.setState({ memberList: res.data });
        // console.log(this.state.memberList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderMemberList = () => {
    return this.state.memberList.map((val, idx) => {
      // console.log(val);
      const { id, username, fullName, email, password, role } = val;
      return (
        <>
          <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter((item) => item !== idx),
                  ],
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx],
                });
              }
            }}
          >
            <td> {id} </td>
            <td> {username} </td>
          </tr>
          <tr
            className={`collapse-item ${
              this.state.activeProducts.includes(idx) ? "active" : null
            }`}
          >
            <td className="" colSpan={3}>
              <div className="d-flex justify-content-around align-items-center">
                <div className="d-flex flex-column ml-4 justify-content-center">
                  <h6>
                    Full Name:
                    <span style={{ fontWeight: "normal" }}> {fullName}</span>
                  </h6>
                  <h6>
                    Email:
                    <span style={{ fontWeight: "normal" }}> {email}</span>
                  </h6>
                  <h6>
                    Password:
                    <span style={{ fontWeight: "normal" }}> {password}</span>
                  </h6>
                  <h6>
                    Role:
                    <span style={{ fontWeight: "normal" }}> {role}</span>
                  </h6>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <ButtonUI
                    onClick={(_) => this.editBtnHandler(idx)}
                    type="contained"
                  >
                    Edit
                  </ButtonUI>
                  <ButtonUI
                    onClick={(_) => this.deleteMemberHandler(id)}
                    className="mt-3"
                    type="textual"
                  >
                    Delete
                  </ButtonUI>
                </div>
              </div>
            </td>
          </tr>
        </>
      );
    });
  };

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    if (field === "price") {
      this.setState({
        [form]: {
          ...this.state[form],
          [field]: parseInt(value),
        },
      });
    } else {
      this.setState({
        [form]: {
          ...this.state[form],
          [field]: value,
        },
      });
    }
  };

  createMemberHandler = () => {
    Axios.post(`${API_URL}/users`, this.state.createForm)
      .then((res) => {
        swal("Success!", "New member has been added to the list", "success");
        this.setState({
          createForm: {
            username: "",
            fullName: "",
            password: "",
            email: "",
            role: "Admin",
            qtyInCart: 0,
          },
        });
        this.getMemberList();
      })
      .catch((err) => {
        swal("Error!", "New member could not be added to the list", "error");
      });
  };

  editBtnHandler = (idx) => {
    this.setState({
      editForm: {
        ...this.state.memberList[idx],
      },
      modalOpen: true,
    });
  };

  editMemberHandler = () => {
    Axios.put(`${API_URL}/users/${this.state.editForm.id}`, this.state.editForm)
      .then((res) => {
        swal("Success!", "Member has been edited", "success");
        this.toggleModal();
        // this.setState({ modalOpen: false });
        this.getMemberList();
      })
      .catch((err) => {
        swal("Error!", "Member could not be edited", "error");
        console.log(err);
      });
  };

  deleteMemberHandler = (id) => {
    Axios.delete(`${API_URL}/users/${id}`)
      .then((res) => {
        this.getMemberList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getMemberList();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="member">
          <caption className="p-3">
            <h2>Members</h2>
          </caption>
          <table className="member-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Name</th>
              </tr>
            </thead>
            <tbody>{this.renderMemberList()}</tbody>
          </table>
        </div>
        <div className="member-form-container p-4">
          <caption className="mb-4 mt-2">
            <h2>Add Member</h2>
          </caption>
          <div className="row">
            <div className="col-12">
              <TextField
                value={this.state.createForm.username}
                placeholder="User Name"
                onChange={(e) => this.inputHandler(e, "username", "createForm")}
              />
            </div>
            <div className="col-12 mt-3">
              <TextField
                value={this.state.createForm.fullName}
                placeholder="Full Name"
                onChange={(e) => this.inputHandler(e, "fullName", "createForm")}
              />
            </div>
            <div className="col-12 mt-3">
              <TextField
                value={this.state.createForm.email}
                placeholder="Email"
                onChange={(e) => this.inputHandler(e, "email", "createForm")}
              />
            </div>
            <div className="col-8 mt-3">
              <TextField
                value={this.state.createForm.password}
                placeholder="Password"
                onChange={(e) => this.inputHandler(e, "password", "createForm")}
              />
            </div>
            <div className="col-6 mt-3">
              <select
                value={this.state.createForm.role}
                className="custom-text-input h-100 pl-3"
                onChange={(e) => this.inputHandler(e, "role", "createForm")}
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-3 mt-3">
              <ButtonUI onClick={this.createMemberHandler} type="contained">
                Create Member
              </ButtonUI>
            </div>
          </div>
        </div>
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Product</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <TextField
                  value={this.state.editForm.username}
                  placeholder="Username"
                  onChange={(e) => this.inputHandler(e, "username", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <TextField
                  value={this.state.editForm.fullName}
                  placeholder="Full Name"
                  onChange={(e) => this.inputHandler(e, "fullName", "editForm")}
                />
              </div>
              <div className="col-12 mt-3">
                <TextField
                  value={this.state.editForm.email}
                  placeholder="Email"
                  onChange={(e) => this.inputHandler(e, "email", "editForm")}
                />
              </div>
              <div className="col-8 mt-3">
                <TextField
                  value={this.state.editForm.password}
                  placeholder="Password"
                  onChange={(e) => this.inputHandler(e, "password", "editForm")}
                />
              </div>
              <div className="col-8 mt-3">
                <select
                  value={this.state.editForm.role}
                  className="custom-text-input h-100 pl-3"
                  onChange={(e) => this.inputHandler(e, "role", "editForm")}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editMemberHandler}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Members;
