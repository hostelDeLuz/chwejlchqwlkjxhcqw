import axios from "axios";
import Image from 'next/image';
import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "../../components/b2b_components/Modal";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
import { BsPencilFill, BsWhatsapp } from "react-icons/bs"
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies, expires } from 'react-cookie';
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Hospede() {
  const [id_, setId] = useState(0);
  const [cookies, setCookie] = useCookies(['user']);
  const { data: checkin } = useSwr(`/api/checkin/getAllCheckin`, fetcher);
  const { data: quartos } = useSwr(`/api/quartos/getAllQuarto`, fetcher);
  const [nomeFiltro, setNomeFiltro] = useState("");
  const [dataInicioFiltro, setDataInicioFiltro] = useState(null);
  const [dataFimFiltro, setDataFimFiltro] = useState(null);
  const [userhostel, setUserhostel] = useState('');
  useEffect(() => {
    setUserhostel(cookies.user_hostel)
  }, [cookies])
  var tamanho = checkin?.length || [];

  function formatDate(dateString) {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  }

  const applyFilter = () => {
    // Lógica para aplicar o filtro nos itens
    // Atualize os estados nomeFiltro, dataInicioFiltro e dataFimFiltro com os valores dos inputs
  };

  return (
    <div style={{ backgroundColor: '#f3f3f3' }}>
      <div style={{ display: 'flex' }}>
        <Menu parametro={'3'} />
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <h1>Hospedes</h1>
                <p className="breadcrumbs">
                  <span>
                    <Link href="/b2b">Dashboard</Link>
                  </span>
                  <span>
                    <i className="mdi mdi-chevron-right"></i>
                  </span>
                </p>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card card-default">
                    <div className="card-body">
                      <div className="table-responsive">
                        {tamanho === 0 && (
                          <div className="text-center">
                            Não possui nenhum cliente cadastrado
                          </div>
                        )}

                        {tamanho !== 0 && (
                          <div>
                            <div className="filters d-flex">   

                              <div className="col-md-6 space-t-15 mt-3 py-1 pr-1">
                                <label htmlFor="phone-2" className="form-label">
                                  Nome
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="phone-2"
                                  value={nomeFiltro}
                                onChange={(e) => setNomeFiltro(e.target.value)}
                                />
                              </div>
                              <div className="col-md-6 space-t-15 mt-3 py-1 pr-1 date-input">
                                <label htmlFor="phone-2" className="form-label">
                                  Entrada
                                </label>
                                <input
                                  type="date"
                                  className="form-control slug-title"
                                  id="phone-2"
                                  onChange={(e) => setDataInicioFiltro(e.target.value)}
                                />
                                <span className="calendar-icon" style={{ top: '47px', right: '25px' }}></span>
                              </div>

                            </div>

                            <table
                              id="responsive-data-table"
                              className="table table-striped"
                              style={{ width: "100%" }}
                            >
                              <thead>
                                <tr>
                                  <th>Nome</th>
                                  <th>Quarto</th>
                                  <th>Telefone</th>
                                  <th>Entrada</th>
                                  <th>Sáida</th>
                                  <th>Estado</th>
                                  <th>Pagamento</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {checkin
                                  ?.filter(item => {
                                    // Filtro por nome
                                    if (nomeFiltro && !item.nome.toLowerCase().includes(nomeFiltro.toLowerCase())) {
                                      return false;
                                    }
                                    if(userhostel === ''){
                                      console.log('adm')
                                    }else if (item.objreserva.hotel !== userhostel) {
                                      return false;
                                    }


                                    // Filtro por período de data
                                    if (dataInicioFiltro) {
                                      const dataEntrada = new Date(item.entrada);
                                      const dataSaida = new Date(item.saidamanha);
                                      const dataInicio = new Date(dataInicioFiltro);
                                      const dataFim = new Date(dataFimFiltro);

                                      return dataInicio >= dataEntrada && dataInicio <= dataSaida;
                                    }

                                    return true;
                                  })
                                  ?.reverse()?.map((item, index) => {
                                    return (
                                      <tr key={item.id} className="align-middle">
                                        <td>{item.nome}</td>
                                        {quartos?.map((item2, index) => {
                                          if (item2._id === item.objreserva.quarto) {
                                            return (
                                              <td key={index}>{item2.titulo}</td>
                                            )
                                          }
                                        })}
                                        <td>{item.telefone}</td>
                                        <td>{formatDate(item.entrada)}</td>
                                        <td>{formatDate(item.saidamanha)}</td>
                                        <td>
                                          <div className={`${item.ativado === '1' ? 'styleativo' : 'styleinativo'}`}>
                                            {item.ativado === '1' ? 'Ativo' : 'Inativo'}
                                          </div>
                                        </td>
                                        <td>
                                          <div className={`${item.pagamentoconcluido === '1' ? 'styleativo' : 'styleinativo'}`}>
                                            {item.pagamentoconcluido === '1' ? 'Pago' : 'Em Aberto'}
                                          </div>
                                        </td>
                                        <td className="text-right">
                                          <div className="btn-group">
                                          <a
                                              href="javasript:void(0)"
                                              data-link-action="editmodal"
                                              title="Edit Detail"
                                              data-bs-toggle="modal"
                                              data-bs-target="#edit_modal"
                                              className="btn btn-primary"
                                              onClick={() => setId(item._id)}
                                              style={{marginRight: '10px'}}
                                              
                                            >
                                              <BsPencilFill />
                                            </a>
                                            <a
                                              target="_blank"
                                              rel="noreferrer"
                                              href={`https://api.whatsapp.com/send?phone=55${item.telefone}&text=Olá, me chamo...`}
                                              title="Whatsapp"
                                              style={{ background: '#25D366' }}
                                              className="btn btn-primary"
                                            >
                                              <BsWhatsapp size={20} />
                                            </a>
                                            
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
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

      <Modal customers={checkin} id_={id_} />
    </div>
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