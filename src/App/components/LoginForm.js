import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "../utils/axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/user";
import { connectSocket } from "../../redux/features/socketClient";
import { Spin } from "antd";
import Modal from "antd/lib/modal/Modal";
function LoginForm() {
  const dispatch = useDispatch();
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    status: false,
    msg: "",
  });
  const history = useHistory();
  const onInputChange = (e) => {
    setAccount({ ...account, [e.target.type]: e.target.value });
  };
  const onSignin = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post("/auth/signin", account).then(async (res) => {
      const { data } = res;
      if (!data.error && data.error !== undefined) {
        let user = data.user;
        user.token = data.token;
        dispatch(setUser(user));
        dispatch(connectSocket(data.token));
        setLoading(false);
        history.push("/chat/welcome");
      } else {
        console.log(data);
        setLoading(false);
        setError({ status: true, msg: data.message });
      }
    });
  };
  return (
    <div className="login-form">
      <Modal
        visible={error.status}
        footer={null}
        onCancel={() => setError({ status: false, msg: "" })}
      >
        <p>{error.msg}</p>
      </Modal>
      {loading && (
        <div className="auth-loading">
          <Spin size="large" />
        </div>
      )}
      <div className="login-text">
        <h3>Log in.</h3>
        <h5>
          Log in with your data that you entered during your registeration
        </h5>
      </div>
      <form className="signin-form">
        <div className="form-item">
          <h5>Enter your email address</h5>
          <input
            onChange={onInputChange}
            value={account.email}
            type="email"
            placeholder="name@example.com"
          />
        </div>
        <div className="form-item">
          <h5>Enter your password</h5>
          <input
            onChange={onInputChange}
            value={account.password}
            type="password"
            suggested="current-password"
            placeholder="Enter your password"
          />
        </div>
        <button onClick={onSignin}>Log in</button>
      </form>
      <div className="login-action">
        <a href="google.com">Forgot password?</a>
        <div>
          <Link className="signup-btn" to={`/auth/signup`}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
