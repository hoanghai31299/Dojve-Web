import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import chatSVG from "../../assets/images/chat.svg";
import LoginForm from "../components/LoginForm";
import Signup from "../components/Signup";
function Login() {
  let { path } = useRouteMatch();
  return (
    <div className="login">
      <div className="login-container max-width">
        <div className="login-left">
          <div className="logo">
            <p>
              Do
              <span>j</span>ve
            </p>
          </div>
          <Switch>
            <Route exact path={path}>
              <LoginForm />
            </Route>
            <Route exact path={`${path}/signup`}>
              <Signup />
            </Route>
          </Switch>
        </div>
        <div className="login-right">
          <h2>Welcome !!!</h2>
          <h4>Log in to start your magical adventure</h4>
          <img src={chatSVG} alt="loginimg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
