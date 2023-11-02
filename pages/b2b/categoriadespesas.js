import axios from "axios";
import { Link } from "next/link";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import router from 'next/router'
import AddCategory from "../../components/b2b_components/categoriadespesas/AddCategory";
import EditCategory from "../../components/b2b_components/categoriadespesas/EditCategory";

import Header from "../../components/b2b_components/Header";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CategoriaDespesas({ }) {
  const [despesasEditId, setCategoryEditId] = useState("");
  const [despesasInfo, setCategoryInfo] = useState([]);
  const [showEditCategoryComponent, setShowEditCategoryComponent] = useState(false);

  const { data: categoriadespesas } = useSwr(`/api/categoriadespesas/getAllCategoria`, fetcher);
  
  var tamanho = categoriadespesas?.length || [];

  const deleteDespesas = async (id) => {
    let data = await axios.delete(`/api/categoriadespesas/deleteCategoria?id=${id}`);
    toast.success("Despesa deletada com sucesso!")
    mutate(`/api/categoriadespesas/getAllCategoria`);
    router.push("/b2b/categoriadespesas");
  };

  return (
    <>
      <div style={{ backgroundColor: '#f3f3f3' }}>
        <div style={{ display: 'flex' }}>
          <Menu  parametro={'9'}/>
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Categoria Despesas</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Categoria Despesas
                  </p>
                </div>
                <div className="row">
                <div className=" col-lg-12">
                    <div className="ec-cat-list card card-default mb-24px">
                      <div className="card-body">
                        {showEditCategoryComponent !== true ? (
                          <AddCategory />
                        ) : (
                          <EditCategory despesasId={despesasEditId} categoriadespesas={categoriadespesas} setShowEditCategoryComponent={setShowEditCategoryComponent}/>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" col-lg-12">
                    <div className="ec-cat-list card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          {tamanho === 0 && (
                            <div className="text-center">
                              Não possui nenhuma despesa cadastrada
                            </div>
                          )}

                          {tamanho !== 0 && (
                            <table id="responsive-data-table" className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Nome</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {categoriadespesas?.map((item) => {
                                  return (
                                    <tr key={item._id} className="align-middle">
                                      <td>{item.titulo}</td>
                                      <td className="text-right">
                                        <div className="btn-group">
                                          <button
                                            type="value"
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                              setCategoryEditId(item._id);
                                              setShowEditCategoryComponent(true);
                                            }}
                                            style={{marginRight: '10px'}}
                                          >
                                            <BsPencilFill />
                                          </button>
                                          <button
                                            className="btn btn-outline-primary delete-btn"
                                            onClick={() => deleteDespesas(item._id)}
                                          >
                                            <FaTrash color="#d93b3b" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
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