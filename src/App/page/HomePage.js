import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/dojve.svg";
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
            <img
              width="100%"
              alt="img-banner"
              src="https://scontent.fdad3-1.fna.fbcdn.net/v/t39.8562-6/120973513_338186077283942_8148888802958728934_n.png?_nc_cat=1&ccb=1-3&_nc_sid=6825c5&_nc_ohc=AL7hveKxZrsAX9ahxiZ&_nc_ht=scontent.fdad3-1.fna&oh=60c9cc09f2478672f3c291155f660bd3&oe=60BC5827"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
