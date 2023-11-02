import axios from "axios";
import router from 'next/router'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditUsers({ usersEditId, users }) {
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const [id_, setId_] = useState();
  const [usersName, setUserName] = useState("");
  const [usersLogin, setUserLogin] = useState("");
  const [usersEmail, setUserEmail] = useState("");
  const [usersPassword, setUsersPassword] = useState("");
  const [usersLevel, setUsersLevel] = useState();
  const [userhostel, setUserhostel] = useState("");

  useEffect(() => {
    users?.map(item => {
      if(item._id === usersEditId ) {
        setUserName(item.name);
        setUserEmail(item.email);
        setUserLogin(item.login);
        setUsersPassword(item.password);
        setUserhostel(item.hostel);
        setId_(item._id);
        if(item.level === 10) {setUsersLevel('funcionarioSite')}
        if(item.level === 20) {setUsersLevel('funcionarioHostel')}
        if(item.level === 40) {setUsersLevel('gerente')}
        if(item.level === 50) {setUsersLevel('webmaster')}
      }
    })
  }, [usersEditId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    var lvlAccess = 0;
    if (usersLevel === 'funcionarioSite') { lvlAccess = 10 }
    if (usersLevel === 'funcionarioHostel') { lvlAccess = 20 }
    if (usersLevel === 'gerente') { lvlAccess = 30 }
    router.reload();
   await axios.put(`/api/users/updateUsers?id=${id_}`, {
      name: usersName,
      email: usersEmail,
      user: usersLogin,
      password: usersPassword,
      hostel: userhostel,
      userlevel: lvlAccess,
      active: 1,
    });
    toast('Usuário sendo adicionado!', {
      position: "top-right",
      });
    mutate(`/api/users`);
  };


  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <h4>Editar</h4>

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
                value={usersName}
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
                value={usersEmail}
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
                value={usersLogin}
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
                value={usersPassword}
                onChange={(e) => setUsersPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="phone-2" className="col-12 col-form-label">
              Hostel
            </label>
            <div className="col-12">
            <select className="form-control here slug-title" value={userhostel} id="cars" onChange={(e) => setUserhostel(e.target.value)}>
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
              
              <option value={usersLevel}>{usersLevel}</option>
                <option value="funcionarioSite">Funcionario Site</option>
                <option value="funcionarioHostel">Funcionario Hostel</option>
                <option value="gerente">Gerente</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
            <button name="submit" type="submit" className="btn btn-primary">
            Editar Acesso
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
