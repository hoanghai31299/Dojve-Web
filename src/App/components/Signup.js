import { InsertEmoticon, SentimentVeryDissatisfied } from "@material-ui/icons";
import { message, Modal, Spin } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
function Signup() {
  const [newAccount, setNewAccout] = useState({
    email: "",
    password: "",
    name: "",
    retype: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({
    status: false,
    msg: "",
    success: false,
  });
  const onInputChange = (e) => {
    setNewAccout((old) => {
      return { ...old, [e.target.name]: e.target.value };
    });
  };
  const validateNewAccount = () => {
    const { email, password, name, retype } = newAccount;
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (
      re.test(String(email).toLowerCase()) &&
      password.length > 0 &&
      name.length > 0 &&
      retype === password &&
      password.length >= 6
    );
  };
  const signup = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateNewAccount()) message.error("Input is not valid!");
    axios.post("/auth/signup", newAccount).then(({ data }) => {
      if (!data.error && data.error !== undefined) {
        setMsg({
          msg: data.message.toUpperCase(),
          success: true,
          status: true,
        });
      } else {
        setMsg({
          msg: data.message.toUpperCase(),
          success: false,
          status: true,
        });
      }
      setLoading(false);
    });
  };
  return (
    <div className="login-form">
      <Modal
        visible={msg.status}
        footer={null}
        onCancel={() => setMsg({ ...msg, status: false })}
        style={{ textAlign: "center" }}
      >
        {msg.success && (
          <InsertEmoticon
            style={{ width: "50px", height: "50px", fill: "green" }}
          />
        )}
        {!msg.success && (
          <SentimentVeryDissatisfied
            style={{ width: "50px", height: "50px", fill: "red" }}
          />
        )}
        <p>{msg.msg}</p>
        {!msg.success && <p>PLEASE TRY AGAIN!</p>}
      </Modal>
      {loading && (
        <div className="auth-loading">
          <Spin size="large" />
        </div>
      )}
      <p className="login-text">
        <h3>Sign up.</h3>
        <h5>Sign up to start your adventure</h5>
      </p>
      <form className="signin-form">
        <div className="form-item">
          <h5>Enter your name</h5>
          <input
            value={newAccount.name}
            onChange={onInputChange}
            type="text"
            name="name"
            placeholder="Enter your real name"
          />
        </div>
        <div className="form-item">
          <h5>Enter your email address</h5>
          <input
            value={newAccount.email}
            onChange={onInputChange}
            type="text"
            name="email"
            placeholder="name@example.com"
          />
        </div>
        <div className="form-item">
          <h5>Enter your password</h5>
          <input
            value={newAccount.password}
            onChange={onInputChange}
            type="password"
            name="password"
            placeholder="at least 6 characters"
          />
        </div>
        <div className="form-item">
          <h5>Enter your password again</h5>
          <input
            name="retype"
            onChange={onInputChange}
            type="password"
            placeholder="make sure of this password"
          />
        </div>
        <button
          style={{
            opacity: !validateNewAccount() ? "0.5" : "1",
          }}
          disabled={!validateNewAccount()}
          onClick={signup}
        >
          Sign up
        </button>
      </form>
      <div className="login-action">
        <span>Have account already?</span>

        <Link className="signup-btn" to="/auth">
          Login now
        </Link>
      </div>
    </div>
  );
}

export default Signup;
