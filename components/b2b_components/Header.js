import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies, expires } from 'react-cookie';
import Image from 'next/image';


export default function Header() {

  // (function () {
  //   if (document.cookie.split(';')[0] === "") {
  //     return navigate("/b2b");
  //   }
  // })();

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  

  function clearCookies() {
    
    setCookie("access_token", "", { path: '/' });
    setCookie("user_id", ``, { path: '/' });
    setCookie("user_login", ``, { path: '/' });

    return navigate("/b2b/login");
  }

  return (
    <header className="ec-main-header" id="header">
      <nav className="navbar justify-content-end navbar-static-top navbar-expand-lg">
        <div className="navbar-right">
          <ul className="nav navbar-nav">
            <li className="dropdown user-menu">
              <button
                className="dropdown-toggle nav-link ec-drop"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  src={require("../../assets/ekka-images/user/user.png")}
                  width={20}
                  alt="User Image"
                />
              </button>
              <ul className="dropdown-menu dropdown-menu-right ec-dropdown-menu">
                <li className="dropdown-header">
                  <Image
                    src={require("../../assets/ekka-images/user/user.png")}
                    className="img-circle"
                    alt="User Image"
                  />
                  <div className="d-inline-block">
                    John Deo{" "}
                    <small className="pt-1">john.example@gmail.com</small>
                  </div>
                </li>
                
                <li className="dropdown-footer">
                  <a onClick={() => clearCookies()}>
                    {" "}
                    <i className="mdi mdi-logout"></i> Log Out{" "}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
