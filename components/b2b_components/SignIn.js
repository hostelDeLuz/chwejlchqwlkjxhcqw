// import '../assets/ekka.css';
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from 'next/image'
import router from "next/router";
import { toast } from "react-toastify";

export default function SignUp({ users }) {
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies(["user"]);


  function login(e) {
    e.preventDefault();
    let contador = 0;
    users?.forEach((item, index) => {
      if (item.login === userLogin && item.password === userPassword) {
        contador++;
        setCookie("access_token", "3erdy34kirud34otud345yc43857cp29458f", { path: '/' });
        setCookie("user_id", `${item._id}`, { path: '/' });
        setCookie("user_login", `${item.login}`, { path: '/' });
        setCookie("user_level", `${item.level}`, { path: '/' });
        setCookie("user_hostel", `${item.hostel}`, { path: '/' });
        toast(`Seja Bem vindo ${item.name}` )
        return router.push("/b2b");
      }else{
        if(contador === 0 && users.length === index + 1){
          contador++;
          toast.error('usuario ou senha incorretos!')
          return
        }
      }
    });

  }

  return (
    <>
    <div className="container vh-100 d-flex align-items-center justify-content-center form-height-login pt-24px pb-24px">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-10">
          <div className="card">
            <div className="card-header bg-primary">
              <div className="ec-brand">
                <a
                  href="#"
                  className="pl-0 w-100 border-0 justify-content-center text-white"
                  title="Ekka"
                >
                  <Image style={{maxWidth: '200px', padding: '15px'}} width={500} src={require('../../assets/img/hostellogo.png')} />
                </a>
              </div>
            </div>
            <div className="card-body p-5">
              <h4 className="text-dark text-center mb-5">Entrar</h4>

              <form onSubmit={login}>
                <div className="row">
                  <div className="form-group col-md-12 mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="text"
                      placeholder="Usuário"
                      value={userLogin}
                      onChange={(e) => setUserLogin(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-md-12 ">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Senha"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>

                  <div className="col-md-12">
                    <button className="btn btn-primary btn-block mb-4">
                      Entrar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center pt-5">
            &copy; 2023 Todos os Direitos Reservados
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
