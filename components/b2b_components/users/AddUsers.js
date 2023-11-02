import { useState } from "react";
import axios from "axios";
import useSwr, { mutate } from "swr";
import router from 'next/router'
import { toast } from "react-toastify";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AddUsers() {
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const [usersName, setUserName] = useState("");
  const [usersEmail, setUserEmail] = useState("");
  const [usersLogin, setUserLogin] = useState("");
  const [usersPassword, setUsersPassword] = useState("");
  const [userhostel, setUserhostel] = useState("");
  const [usersLevel, setUsersLevel] = useState(0);
  console.log(usersName, usersEmail, usersLogin, usersPassword, usersLevel)
  const onSubmit = async (e) => {
    e.preventDefault();
    var lvlAccess = 0;

    if (usersLevel === 'funcionarioSite') { lvlAccess = '10' }
    if (usersLevel === 'funcionarioHostel') { lvlAccess = '20' }
    if (usersLevel === 'funcionarioLoja') { lvlAccess = '30' }
    if (usersLevel === 'gerente') { lvlAccess = '40' }
    toast('Usuário sendo adicionado!', {
      position: "top-right",
    });
    mutate(`/api/users`);
    await axios.post(`/api/users/insertUsers`, {
      name: usersName,
      email: usersEmail,
      user: usersLogin,
      password: usersPassword,
      hostel: userhostel,
      userlevel: lvlAccess,
      active: 1,
      
    });
    
    router.reload();
    
  };

  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <h4>Adicionar Acesso</h4>
        <form onSubmit={onSubmit}>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Nome
            </label>
            <div className="col-12">
              <input
                id="text"
                name="text"
                className="form-control here slug-title"
                type="text"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              E-mail
            </label>
            <div className="col-12">
              <input
                id="text"
                name="text"
                className="form-control here slug-title"
                type="email"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Login
            </label>
            <div className="col-12">
              <input
                id="text"
                name="text"
                className="form-control here slug-title"
                type="text"
                onChange={(e) => setUserLogin(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="color" className="col-12 col-form-label">
              Senha
            </label>
            <div className="col-12">
              <input
                id="password"
                name="password"
                className="form-control here slug-title"
                onChange={(e) => setUsersPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="phone-2" className="col-12 col-form-label">
              Hostel
            </label>
            <div className="col-12">
            <select className="form-control here slug-title" id="cars" onChange={(e) => setUserhostel(e.target.value)}>
              <option value='todos'>Todos os Hostels</option>
              {hoteis?.map((item, index) => {
                return (<option key={item._id} value={item._id}>{item.titulo}</option>)
              })}
            </select>
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="color" className="col-12 col-form-label">
              Level
            </label>
            <div className="col-12">
              <select
                id="color"
                name="color"
                className="form-control here slug-title"
                onChange={(e) => setUsersLevel(e.target.value)}
              >

                <option value="">Escolha o acesso</option>
                <option value="funcionarioSite">Funcionario Site</option>
                <option value="funcionarioHostel">Funcionario Hostel</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
                Adicionar Acesso
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
