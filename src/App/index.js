import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import routers from "./router";
import { setUser } from "../redux/features/user";
import { connectSocket, disconnect } from "../redux/features/socketClient";
import { useDispatch } from "react-redux";
import axios from "./utils/axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cookies from "universal-cookie";
function HomePage() {
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);
  const link = window.location.href;
  const email = link.indexOf("email") > -1;
  useEffect(() => {
    axios.get("/auth/signinW").then((res) => {
      const { data } = res;
      if (data.error === false) {
        let user = data.user;
        user.token = data.token;
        dispatch(setUser(user));
        const cookies = new Cookies();
        cookies.set("token", data.token);
        cookies.set("refreshToken", data.refreshToken);
        dispatch(connectSocket(data.token));
      } else {
        setRedirect(true);
      }
    });
    return () => {
      dispatch(disconnect);
    };
  }, [dispatch]);

  // if (!user.name) return <Redirect to="/auth" />;
  return (
    <Router>
      {redirect && !email && <Redirect to="/" />}
      <div className="home">
        <Switch>
          {routers.map((route, i) => (
            <Route
              key={i}
              exact={route.exact}
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </div>
    </Router>
  );
}

export default HomePage;
