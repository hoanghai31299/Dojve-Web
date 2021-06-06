import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/dojve.svg";
import HomeImage from "../../assets/images/hp.png";
function HomePage() {
  const user = useSelector((state) => state.user.current);
  const chatLink = "/chat/welcome";
  const signinLink = "/auth";
  return (
    <div className="home">
      <div className="home-container">
        <div className="header">
          <img alt="logo" src={Logo} />
        </div>
        <div className="content">
          <div className="content-left">
            <h1 className="title-maxim">
              Gather, <br /> everytime, everywhere
            </h1>
            <div className="des">
              With Dojve connecting with the people you love is simple and fun.
            </div>
            {
              <div className="button-log">
                {user.name ? (
                  <Link to={chatLink}>Continue with {user.name}</Link>
                ) : (
                  <Link to={signinLink}>
                    Sign in to start amazing adventure
                  </Link>
                )}
              </div>
            }
          </div>
          <div className="content-right">
            <img width="100%" alt="img-banner" src={HomeImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
