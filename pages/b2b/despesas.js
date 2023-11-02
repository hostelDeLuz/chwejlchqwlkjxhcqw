import axios from "axios";
import { Link } from "next/link";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import router from 'next/router'
import AddCategory from "../../components/b2b_components/despesas/AddCategory";
import EditCategory from "../../components/b2b_components/despesas/EditCategory";

import Header from "../../components/b2b_components/Header";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useCookies, expires } from 'react-cookie';
export default function Despesas({ }) {
  const [despesasEditId, setCategoryEditId] = useState("");
  const [despesasInfo, setCategoryInfo] = useState([]);
  const [showEditCategoryComponent, setShowEditCategoryComponent] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);
  const [userhostel, setUserhostel] = useState('');
  useEffect(() => {
    setUserhostel(cookies.user_hostel)
  }, [cookies])
  const { data: despesas } = useSwr(`/api/despesas/getAllDespesas`, fetcher);

  var tamanho = despesas?.length || [];

  const deleteDespesas = async (id) => {
    let data = await axios.delete(`/api/despesas/deleteDespesas?id=${id}`);
    toast.success("Despesa deletada com sucesso!")
    mutate(`/api/despesas/getAllDespesas`);
    router.push("/b2b/despesas");
  };
  
  const formatter = new Intl.NumberFormat('bt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <>
      <div style={{ backgroundColor: '#f3f3f3' }}>
        <div style={{ display: 'flex' }}>
          <Menu parametro={'8'} />
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Despesas</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Despesas
                  </p>
                </div>
                <div className="row">
                  <div className=" col-lg-12">
                    <div className="ec-cat-list card card-default mb-24px">
                      <div className="card-body">
                        {showEditCategoryComponent !== true ? (
                          <AddCategory />
                        ) : (
                          <EditCategory despesasId={despesasEditId} despesas={despesas} setShowEditCategoryComponent={setShowEditCategoryComponent} />
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
                                  <th>Cadastro</th>
                                  <th>Quantidade</th>
                                  <th>Valor</th>
                                  <th>Descrição</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {despesas?.map((item) => {
                                  console.log(item)
                                  if(item.hostel === userhostel){
                                    const formattedDate = format(new Date(item.entrada), 'dd/MM/yyyy', { locale: ptBR });
                                    return (
                                      <tr key={item._id} className="align-middle">
                                        <td>{item.titulo}</td>
                                        <td>{formattedDate}</td>
                                        <td>{item.quantidade}</td>
                                        <td>{formatter.format(parseFloat(item.valor))}</td>
                                        <td>{item.descricao.length >= 20 ? `${item.descricao.slice(0, 20)}...` : `${item.descricao}`}</td>
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
                                  }
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