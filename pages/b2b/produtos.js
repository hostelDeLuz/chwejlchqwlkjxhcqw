import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

import Image from 'next/image'
import router from 'next/router'
import AddProdutos from "../../components/b2b_components/produtos/Add";
import EditProdutos from "../../components/b2b_components/produtos/Edit";

import Menu from "../../components/b2b_components/Menu";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Produtos() {
  const [produtosEditId, setProdutosEditId] = useState("");
  const [showEditProdutosComponent, setShowEditProdutosComponent] = useState(false);

  const { data: produtos } = useSwr(`/api/produtos/getAllProdutos`, fetcher);

  var tamanho = produtos?.length || [];

  const formatter = new Intl.NumberFormat('bt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const deleteProdutos = async (id) => {
    await axios.delete(`/api/produtos/deleteProdutos?id=${id}`);
    mutate(`/api/produtos/getAllProdutos`);
    router.push("/b2b/produtos");
  };

  return (
    <>
      <div style={{ backgroundColor: '#f3f3f3' }}>
        <div style={{ display: 'flex' }}>
          <Menu parametro={'17'} />
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Produtos</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Produtos
                  </p>
                </div>
                <div className="row">

                  <div className="col-12">
                    <div className="ec-cat-list card card-default mb-24px">
                      {showEditProdutosComponent !== true ? (
                        <AddProdutos />
                      ) : (
                        <EditProdutos produtosId={produtosEditId} produtos={produtos} setShowEditProdutosComponent={setShowEditProdutosComponent} />
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="ec-cat-list card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          {tamanho === 0 && (
                            <div className="text-center">
                              Não possui nenhum produto cadastrado
                            </div>
                          )}

                          {tamanho !== 0 && (
                            <table id="responsive-data-table" className="table">
                              <thead>
                                <tr>
                                  <th>Nome</th>
                                  <th>Estoque</th>
                                  <th>Compra</th>
                                  <th>Venda</th>
                                  <th>Imagem</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {produtos?.reverse()?.map((item, index) => {
                                  return (
                                    <tr key={index} className="align-middle">
                                      <td>{item.nome}</td>
                                      <td>{item.estoque}</td>
                                      <td>{formatter.format(parseFloat(item.valorCompra))}</td>
                                      <td>{formatter.format(parseFloat(item.valorVenda))}</td>
                                      <td>{<Image src={item?.imagem[0].url} width={80} height={80} style={{width:'100px', height:'auto'}} />}</td>
                                      <td className="text-right">
                                        <div className="btn-group">
                                          <button
                                            type="value"
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                              setProdutosEditId(item._id);
                                              setShowEditProdutosComponent(true);
                                            }}
                                          >
                                            <FaPencilAlt />
                                          </button>
                                          <button
                                            className="btn btn-outline-primary delete-btn"
                                            onClick={() => deleteProdutos(item._id)}
                                          >
                                            <FaTrashAlt color="#cc0000" />
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