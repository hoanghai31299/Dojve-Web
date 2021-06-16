import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
function Email() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios
      .get(`/auth/verify/${token}`)
      .then(({ data }) => {
        setLoading(false);
        if (data.error !== undefined && !data.error) {
          setMessage("Verified sucess!!! Welcome");
        } else {
          setMessage("Faild to verified!! Please try again");
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage("Faild to verified!! Please try again");
      });
  }, [token]);
  return (
    <div className="authenticate">
      {loading && (
        <div className="loading-authenticate">
          <div>
            <Spin size="large" />
          </div>
          <p>Wait a minute...</p>
        </div>
      )}
      {!loading && (
        <div className="sucess-auth">
          <p>{message}</p>
          <Link to="/auth">Signin now</Link>
        </div>
      )}
    </div>
  );
}

export default Email;
