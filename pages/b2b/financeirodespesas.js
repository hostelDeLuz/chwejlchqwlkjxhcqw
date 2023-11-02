import axios from "axios";
import Image from 'next/image';
import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "../../components/b2b_components/Modal";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import ReactToPrint from 'react-to-print';
import { useRef } from "react";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Financeirodespesas() {
    const { data: allcategorias } = useSwr(`/api/categoriadespesas/getAllCategoria`, fetcher);
    const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
    const [id_, setId] = useState(0);
    const [rendatotal, setRendatotal] = useState(0);
    const [pagototal, setPagototal] = useState(0);
    const [rendatotal2, setRendatotal2] = useState(0);
    const [hospedes2, setHospedes2] = useState(0);
    const [entrada, setEntrada] = useState('');
    const [saida, setSaida] = useState('');
    const [despesasArr, setCheckinArr] = useState([]);
    const [categoria, setCategoria] = useState("todos");
    const [hostel, setHostel] = useState("todos");
    const innerPageRef = useRef();
    const { data: despesas } = useSwr(`/api/despesas/getAllDespesas`, fetcher);
    const { data: quartos } = useSwr(`/api/quartos/getAllQuarto`, fetcher);
    var tamanho = despesas?.length || [];

    useEffect(() => {
        let valortotal = 0;
        let itensativos = 0;
        despesas?.reverse()?.map((item, index) => {
            itensativos = itensativos + 1;
            valortotal = valortotal + parseFloat(item.valor)
            if (despesas.length === index + 1) {
                setRendatotal2(valortotal);
                setCheckinArr(despesas);
                setHospedes2(itensativos);
            }
        })
    }, [despesas])

    const filtrar = () => {
        let newarr = [];
        let valortotal = 0;
        let itensativos = 0;
        if (categoria === 'todos' && hostel === 'todos') {
            despesas?.map((item, index) => {
                const dataEntradaNovaReserva = new Date(entrada);
                const dataSaidaNovaReserva = new Date(saida);
                const dataEntradaReserva = new Date(item.entrada);
                const quartoVago = (dataSaidaNovaReserva >= dataEntradaReserva) && (dataEntradaNovaReserva <= dataEntradaReserva);
                if (quartoVago) {
                    itensativos = itensativos + 1;
                    valortotal = valortotal + parseFloat(item.valor);
                    newarr.push(item);
                }
                if (despesas.length === index + 1) {
                    setCheckinArr(newarr);
                    setRendatotal2(valortotal);
                    setHospedes2(itensativos);
                }
            });
        } else if (categoria !== 'todos' && hostel === 'todos') {
            despesas?.map((item, index) => {
                if (item.categoria === categoria) {
                    const dataEntradaNovaReserva = new Date(entrada);
                    const dataSaidaNovaReserva = new Date(saida);
                    const dataEntradaReserva = new Date(item.entrada);
                    const quartoVago = (dataSaidaNovaReserva >= dataEntradaReserva) && (dataEntradaNovaReserva <= dataEntradaReserva);
                    if (quartoVago) {
                        itensativos = itensativos + 1;
                        valortotal = valortotal + parseFloat(item.valor);
                        newarr.push(item);
                    }
                }
                if (despesas.length === index + 1) {
                    setCheckinArr(newarr);
                    setRendatotal2(valortotal);
                    setHospedes2(itensativos);
                }
            });
        } else if (categoria === 'todos' && hostel !== 'todos') {
            despesas?.map((item, index) => {
                if (item.hostel === hostel) {
                    const dataEntradaNovaReserva = new Date(entrada);
                    const dataSaidaNovaReserva = new Date(saida);
                    const dataEntradaReserva = new Date(item.entrada);
                    const quartoVago = (dataSaidaNovaReserva >= dataEntradaReserva) && (dataEntradaNovaReserva <= dataEntradaReserva);
                    if (quartoVago) {
                        itensativos = itensativos + 1;
                        valortotal = valortotal + parseFloat(item.valor);
                        newarr.push(item);
                    }
                }
                if (despesas.length === index + 1) {
                    setCheckinArr(newarr);
                    setRendatotal2(valortotal);
                    setHospedes2(itensativos);
                }
            });
        } else if (categoria !== 'todos' && hostel !== 'todos') {
            despesas?.map((item, index) => {
                if (item.hostel === hostel && item.categoria === categoria) {
                    const dataEntradaNovaReserva = new Date(entrada);
                    const dataSaidaNovaReserva = new Date(saida);
                    const dataEntradaReserva = new Date(item.entrada);
                    const quartoVago = (dataSaidaNovaReserva >= dataEntradaReserva) && (dataEntradaNovaReserva <= dataEntradaReserva);
                    if (quartoVago) {
                        itensativos = itensativos + 1;
                        valortotal = valortotal + parseFloat(item.valor);
                        newarr.push(item);
                    }
                }
                if (despesas.length === index + 1) {
                    setCheckinArr(newarr);
                    setRendatotal2(valortotal);
                    setHospedes2(itensativos);
                }
            });
        }
    };


    const todosarr = () => {
        let newarr = [];
        let valortotal = 0;
        let itensativos = 0;
        despesas?.map((item, index) => {
            newarr.push(item)
            itensativos = itensativos + 1;
            valortotal = valortotal + parseFloat(item.valor)
            if (despesas.length === index + 1) {
                setRendatotal2(valortotal);
                setCheckinArr(newarr)
                setHospedes2(itensativos);
            }
        });

    }

    const formatter = new Intl.NumberFormat('bt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    return (
        <div style={{ backgroundColor: '#f3f3f3' }}>
            <div style={{ display: 'flex' }}>
                <Menu parametro={'10'} />
                <div className="ec-page-wrapper">
                    <div className="ec-content-wrapper">
                        <div className="content" ref={innerPageRef}>
                            <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                                <h1>Financeiro Despesas</h1>
                                <ReactToPrint
                                    trigger={() => <div className="pr-1">
                                    <button className="btn btn-primary text-white">Download</button>
                                </div>}
                                    content={() => innerPageRef.current}
                                    pageStyle={`@page { padding: 20px; }`}
                                />
                                <p className="breadcrumbs">
                                    <span>
                                        <Link href="/b2b">Dashboard</Link>
                                    </span>
                                    <span>
                                        <i className="mdi mdi-chevron-right"></i>
                                    </span>
                                    Financeiro Despesas
                                </p>
                            </div>

                            <div className="d-flex flex-wrap align-items-end">
                                <div className="d-flex flex-wrap col-12 col-md-9 p-0">
                                    <div className="col-md-3 col-6 space-t-15 mt-3 py-1 pr-1 date-input">
                                        <label htmlFor="phone-2" className="form-label">
                                            Inicio
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control slug-title"
                                            id="phone-2"
                                            onChange={(e) => setEntrada(e.target.value)}
                                        />
                                        <span className="calendar-icon" style={{ top: '47px', right: '25px' }}></span>
                                    </div>
                                    <div className="col-md-3 col-6 space-t-15 mt-3 py-1 pr-1 date-input">
                                        <label htmlFor="phone-2" className="form-label">
                                            Fim
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control slug-title"
                                            id="phone-2"
                                            onChange={(e) => setSaida(e.target.value)}
                                        />
                                        <span className="calendar-icon" style={{ top: '47px', right: '25px' }}></span>
                                    </div>
                                    <div className="col-md-3 col-6 space-t-15 mt-3 py-1 pr-1">
                                        <label htmlFor="phone-2" className="form-label">
                                            Categoria
                                        </label>
                                        <select className="form-control" id="cars" onChange={(e) => setCategoria(e.target.value)}>
                                            <option value='todos'>Todas</option>
                                            {allcategorias?.map((item, index) => {
                                                return (<option key={index} value={item._id}>{item.titulo}</option>)
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-md-3 col-6 space-t-15 mt-3 py-1 pr-1">
                                        <label htmlFor="phone-2" className="form-label">
                                            Hostel
                                        </label>
                                        <select className="form-control" id="cars" onChange={(e) => setHostel(e.target.value)}>
                                            <option value='todos'>Todos os Hostels</option>
                                            {hoteis?.map((item, index) => {
                                                return (<option key={item._id} value={item._id}>{item.titulo}</option>)
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex col-12 col-md-3 space-t-15 mt-3 py-1 text-center">
                                    <div className="col-6 pr-1">
                                        <button className="btn btn-primary text-white w-100" onClick={filtrar}>Filtrar</button>
                                    </div>
                                    <div className="col-6">
                                        <button className="btn btn-primary text-white w-100" onClick={todosarr}>Limpar</button>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-12 modalprice">
                                    <h5 className="text-white">Número de Despesas</h5>
                                    <div className="text-white">{hospedes2}</div>
                                </div>
                                <div className="col-lg-6 col-12 modalprice" style={{background: '#D83B3B'}}>
                                    <h5 className="text-white">Valor Total</h5>
                                    <div className="text-white">{formatter.format(rendatotal2)}</div>
                                </div>

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
                                                    <table
                                                        id="responsive-data-table"
                                                        className="table table-striped"
                                                        style={{ width: "100%" }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>Categoria</th>
                                                                <th>Cadastro</th>
                                                                <th>Título</th>
                                                                <th>Valor</th>
                                                                <th>Descrição</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {despesasArr?.reverse()?.map((item, index) => {
                                                                 const formattedDate = format(new Date(item.entrada), 'dd/MM/yyyy', { locale: ptBR });
                                                                return (
                                                                    <tr key={index} className="align-middle">
                                                                        <td>
                                                                            {allcategorias?.map((item2, index2) => {
                                                                                if (item.categoria === item2._id) {
                                                                                    return (
                                                                                        <p key={index2}>{item2.titulo}</p>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </td>
                                                                        <td>{formattedDate}</td>
                                                                        <td>{item.titulo}</td>
                                                                        <td>{formatter.format(item.valor)}</td>
                                                                        <td style={{ borderLeft: '1px solid black', maxWidth: '160px', minWidth: '160px' }} className="text-left">
                                                                            {item.descricao}
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

            <Modal customers={despesas} id_={id_} />
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
