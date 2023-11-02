import axios from "axios";
import { Link } from "next/link";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import router from 'next/router'
import AddUsers from "../../components/b2b_components/users/AddUsers";
import EditUsers from "../../components/b2b_components/users/EditUsers";

import Header from "../../components/b2b_components/Header";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Users({ }) {
  const [usersEditId, setUsersEditId] = useState("");
  const [showEditCategoryComponent, setShowEditCategoryComponent] = useState(false);

  const { data: users } = useSwr(`/api/users/getAllUsers`, fetcher);

  var tamanho = users?.length || [];

  const deleteUsers = async (id) => {
    await axios.delete(`/api/users/deleteUsers?id=${id}`)
    .then(() => {
      toast.success("Cliente deletado com sucesso!");
      mutate(`/api/users/getAllUsers`);
    })
    .catch((err) => console.log(err));
    mutate('/api/users/getAllUsers');
  };

  return (
    <>
      <div style={{ backgroundColor: '#f3f3f3' }}>
        <div style={{ display: 'flex' }}>
          <Menu  parametro={'16'}/>
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Acessos</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Usuários
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="ec-cat-list card card-default mb-24px">
                      <div className="card-body">
                        {showEditCategoryComponent !== true ? (
                          <AddUsers />
                        ) : (
                          <EditUsers usersEditId={usersEditId} users={users} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="ec-cat-list card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          {tamanho === 0 && (
                            <div className="text-center">
                              Não possui nenhum Acesso cadastrada
                            </div>
                          )}

                          {tamanho !== 0 && (
                            <table id="responsive-data-table" className="table table-striped">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nome</th>
                                  <th>E-mail</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {users?.map((item) => {
                                  if(item.level === 50) {
                                    return(<></>)
                                  }else{
                                  return(
                                  <tr key={item.id} className="align-middle">
                                      <td>{item.id}</td>
                                      <td>{item.name}</td>
                                      <td>
                                        <div>{item.email}</div>
                                      </td>
                                      <td className="text-right">
                                        <div className="btn-group">
                                          <button
                                            type="value"
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                            setUsersEditId(item._id);
                                            setShowEditCategoryComponent(true);
                                            }}
                                            style={{marginRight: '10px'}}
                                          >
                                            <BsPencilFill />
                                          </button>
                                          <button
                                            className="btn btn-outline-primary delete-btn"
                                            onClick={() => deleteUsers(item._id)}
                                          >
                                            <FaTrash color="#d93b3b" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>)
                                }})}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </div>
    </>
  );
}


export const getServerSideProps = async (ctx) => {

  const myCookie = ctx.req?.cookies || "";

  if (myCookie.access_token !== process.env.TOKEN) {
    return {
      redirect: {
        destination: "/b2b/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};