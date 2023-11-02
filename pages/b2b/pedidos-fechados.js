import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import useSwr, { mutate } from "swr";
import { toast } from "react-toastify";
import Menu from "../../components/b2b_components/Menu";
import Link from "next/link"
import router from "next/router";
import { BsFillEyeFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
const fetcher = (url) => fetch(url).then((res) => res.json());
import { useCookies, expires } from 'react-cookie';

export default function PedidosFechados({ }) {
  const [searchItemComanda, setSearchItemComanda] = useState("");
  const [searchItemData, setSearchItemData] = useState("");
  const [filter, setFilter] = useState([]);
  const [totalTableValue, setTotalTableValue] = useState(0);
  const [existe, setExiste] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);
  const [userhostel, setUserhostel] = useState('');
  useEffect(() => {
    setUserhostel(cookies.user_hostel)
  }, [cookies])
  const { data: pedido } = useSwr(`/api/pedidos/getAllPedidos`, fetcher);


  const formatter = new Intl.NumberFormat('bt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  useEffect(() => {
    setFilter(pedido?.reverse())
  }, [pedido])

  useEffect(() => {
    valuesToTable();
  }, [filter]);

  const valuesToTable = (e) => {
    let values = [];
    let valorTotalFinal = 0;

    filter?.map((item, index) => {
      if (item.ativo === '0' && userhostel === item.hostel || userhostel === '' && item.ativo === '0') {
        values.push({
          id: item._id,
          valorTotal: parseFloat(item.valor_total)
        });
        setExiste(true);
      }
    })

    values.forEach(item => {
      valorTotalFinal += item.valorTotal;
    });

    setTotalTableValue(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(
        valorTotalFinal
      )
    );
  }

  useEffect(() => {
    let itemObtidoComanda;
    setFilter(pedido?.filter(item => {
      itemObtidoComanda = item.comandas.toLowerCase().includes(searchItemComanda);
      return itemObtidoComanda;
    }));
  }, [searchItemComanda]);

  useEffect(() => {
    let itemObtidoData;
    let contador = 0;
    setFilter(pedido?.filter((item, index) => {
      let dataPedido = new Date(item.data_pedido).toLocaleDateString('pt-BR');
      itemObtidoData = dataPedido.toLowerCase().includes(searchItemData);
      if (searchItemData === 'Invalid Date') {
        return true;
      } else {
        return itemObtidoData;
      }
    }));

  }, [searchItemData]);

  const deletePedido = async (id) => {
    await axios.delete(`/api/pedidos/deletePedido?id=${id}`);
    mutate(`/api/pedidos/getAllPedidos`);
    router.push("/b2b/pedidos");
  };

  return (
    <>
      <div className="bg-geral">
        <div style={{ display: 'flex' }}>
          <Menu parametro={'20'} />
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Pedidos Fechados</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Pedidos Fechados
                  </p>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="ec-cat-list card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          <div className="d-flex">
                            <div className="col-12 col-md-6 pr-1">
                              <input
                                type="searchComanda"
                                placeholder="Digite sua busca por Comprador"
                                className="form-control here slug-title"
                                onChange={(e) => { setSearchItemComanda(e.target.value.toLowerCase()) }}
                              />
                            </div>
                            <div className="col-12 col-md-6 date-input">
                              <input
                                type="date"
                                placeholder="Digite sua busca por data"
                                className="form-control here slug-title"
                                onChange={(e) => {
                                  const selectedDate = new Date(e.target.value);
                                  const formattedDate = selectedDate.toLocaleDateString("pt-BR");
                                  setSearchItemData(formattedDate);
                                }}
                              />
                              <span className="calendar-icon" style={{ top: '12px', right: '25px' }}></span>
                            </div>
                          </div>
                          <table id="responsive-data-table" className="table">
                            <thead>
                              <tr>
                                <th>Data</th>
                                <th>Comprador</th>
                                <th>Valor Final</th>
                                <th>Abertura</th>
                                <th>Fechamento</th>
                                <th>Aberto Por</th>
                                <th></th>
                              </tr>
                            </thead>

                            <tbody>
                              {filter?.reverse()?.map((item, index) => {
                                if (userhostel === item.hostel && item.ativo === '0' || userhostel === '' && item.ativo === '0') {
                                  const originalDate = item.dataentrada;
                                  const fechamentoDate = item.datafechamento;
                                  let fechamentoDateformat = '';
                                  if (fechamentoDate !== '') {
                                    fechamentoDateformat = format(new Date(fechamentoDate), 'dd/MM/yyyy', { locale: ptBR });
                                  }
                                  const formattedDate = format(new Date(originalDate), 'dd/MM/yyyy', { locale: ptBR });

                                  const dataPedido = new Date(item.data_pedido.split('T')[0]);
                                  const dia = String(dataPedido.getUTCDate()).padStart(2, '0');
                                  const mes = String(dataPedido.getUTCMonth() + 1).padStart(2, '0');
                                  const ano = dataPedido.getUTCFullYear();
                                  const dataFormatada = `${dia}/${mes}/${ano}`;

                                  return (
                                    <tr key={index} className="align-middle">
                                      <td>{dataFormatada}</td>
                                      <td>{item.comandas}</td>
                                      <td>{formatter.format(item.valor_total)}</td>
                                      <td>{formattedDate}</td>
                                      <td>{fechamentoDateformat}</td>
                                      <td>{item.acesso_comanda}</td>
                                      <td className="text-right">
                                        <div className="btn-group">
                                          <Link
                                            href={{
                                              pathname: '/b2b/pedidos-visualizar',
                                              query: { id: `${item?._id}` }
                                            }}
                                            title="Edit Detail"
                                            style={{ marginRight: '10px' }}
                                            className="btn btn-primary"
                                          >
                                            <BsPencilFill />
                                          </Link>
                                          <button
                                            className="btn btn-outline-info delete-btn"
                                            onClick={() => deletePedido(item._id)}
                                          >
                                            <FaTrash color="#DC3545" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              })}

                            </tbody>
                            {/* <tfoot>
                              <tr>
                                <th>Qtd.</th>
                                <th>{existe > 0 ? filter?.length : '0'}</th>
                                <th>Valor Total</th>
                                <th>{totalTableValue}</th>
                                <th></th>
                              </tr>
                            </tfoot> */}
                          </table>
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
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};