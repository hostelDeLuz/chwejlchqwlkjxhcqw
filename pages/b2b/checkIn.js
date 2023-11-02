import axios from "axios";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";

import { toast } from "react-toastify";
import router from 'next/router';
import Link from "next/link";
import bg1 from '../../assets/img/quarto-de-luxo-no-hotel.jpg'
import Image from "next/image";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import Calendario from '../../components/b2b_components/Calendario'
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());
import { useCookies, expires } from 'react-cookie';
import CurrencyInput from 'react-currency-input-field'
import formatCpf from '@brazilian-utils/format-cpf';
import Menu from "../../components/b2b_components/Menu";

export default function Checkin() {
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const { data: quartos } = useSwr(`/api/quartos/getAllQuarto`, fetcher);
  const { data: hospedes } = useSwr(`/api/hospedes/getAllHospedes`, fetcher);
  const [arrdatas, setArrdatas] = useState([]);
  const [Name, setName] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [passaporte, setPassaporte] = useState("vazio");
  const [entrada, setEntrada] = useState("")
  const [saida, setSaida] = useState("")
  const [datanascimento, setDatanascimento] = useState("")
  const [telefone, setTelefone] = useState("")
  const [formapagamento, setFormaPagamento] = useState("")
  const [observacoes, setObservações] = useState("")
  const [valorpago, setValorpago] = useState('')
  const [valordiaria, setValordiaria] = useState('')
  const [hotel, setHotel] = useState("");
  const [quarto, setQuarto] = useState([]);
  const [nomequarto, setNomeQuarto] = useState('');
  const [numerocama, setNumerocama] = useState('');
  const [genero, setGenero] = useState("");
  const [idquarto, setIdquarto] = useState("");
  const [objreserva, setObjreserva] = useState([]);
  const [active, setActive] = useState('1');
  const [pagamentoconcluido, setPagamentoConcluido] = useState('0');
  const checkinID = Math.floor(Math.random() * 10000000000000000000);
  const currentDate = new Date(saida);
  const previousDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  let userID = cookies.user_id;
  let contadordisponivel = 0;
  let contadorrenderizado = 0;
  let titulo_ = '';
  let camas = '';
  let arrCamas = [];
  let imagem = [];
  let hotel_ = '';
  let genero_ = '';
  let ativado = '';
  let cadastrado = false;

  const registrarQuarto = (numerocama) => {
    setObjreserva({
      hotel: hotel,
      quarto: idquarto,
      cama: numerocama,
    })
  }

  const datamudou = (valor, parametro) => {
    if (entrada === '' && parametro === 'entrada') {
      setEntrada(valor)
      return
    }
    if (entrada !== '' && parametro === 'entrada') {
      setEntrada(valor)
      return
    }
    if (saida === '' && parametro === 'saida' && entrada <= valor) {
      setSaida(valor)
      return
    } else if (valor <= saida || entrada <= valor && entrada !== '' && saida !== '') {
      if (parametro === 'entrada' && valor < saida) {
        setEntrada(valor)
        return
      } else if (parametro === 'saida' && entrada < valor) {
        setSaida(valor)
        return
      } else { toast.error('Saída maior que entrada') }
    } else {
      toast.error('Saída maior que entrada')
    }

  }

  const dispararcheckin = async () => {
    let data = await axios.post(`/api/checkin/insertCheckin`, {
      nome: Name,
      rg: rg,
      cpf: cpf,
      passaporte: passaporte,
      datanascimento: datanascimento,
      telefone: telefone,
      genero: genero,
      entrada: entrada,
      diaLimpeza: entrada,
      saidamanha: saida,
      saida: previousDate.toISOString().slice(0, 10),
      formapagamento: formapagamento,
      valorpago: parseFloat(valorpago),
      valordiaria: parseFloat(valordiaria),
      observacoes: observacoes,
      objreserva: objreserva,
      ativado: active,
      pagamentoconcluido: pagamentoconcluido,
      checkinID: checkinID,
      usuario: userID,
      acesso_comanda: cookies.user_login,
    });
    mutate('/api/checkin/getAllCheckin');
  }
  const dispararquarto = async () => {
    const response1 = await axios.post(`/api/quartos/updateQuarto?id=${objreserva.quarto}`, {
      titulo: titulo_,
      camas: camas,
      arrCamas: arrCamas,
      imagem: imagem,
      hotel: hotel_,
      genero: genero_,
      ativado: ativado,
    });
    mutate('/api/quartos/getAllQuarto');
  }

  const dispararbanco = async () => {
    if(Name === '' || datanascimento === '' || entrada === '' || saida === '' || telefone === '' || numerocama === '' || valorpago === '' || valordiaria === ''){return toast.error('Preencha os campos corretamente!')}
    let contador = 0;
    const dataEntradaNovaReserva = new Date(entrada);
    const dataSaidaNovaReserva = new Date(saida);


    quartos?.map((item, index) => {
      contador++
      if (item._id === idquarto) {
        item.arrCamas?.map((item2, index) => {
          let contadorcamas = 0;


          item2?.map((item3, index2) => {
            if (item3.numeroCama === numerocama && contadorcamas === 0) {
              contadorcamas++;
              item2.push({
                numeroCama: numerocama,
                vago: true,
                hospede: Name,
                limpeza: entrada,
                entrada: entrada,
                saida: saida,
                base: false,
                checkinID: checkinID,
              })
              titulo_ = item.titulo;
              camas = item.camas;
              arrCamas = item.arrCamas;
              imagem = item.imagem;
              hotel_ = item.hotel;
              genero_ = item.genero;
              ativado = item.ativado;
            }
          })
        })
      }
    })

    if (quartos.length === contador) {
      try {
        toast.success('Check-in sendo realizado!')

        dispararquarto()

        dispararcheckin()

        // Executa a segunda solicitação apenas se a primeira for concluída com sucesso

        router.push("/b2b/customers");
      } catch (error) {
        console.error(error);
      }
    }

  }

  const verificar = (id) => {
    if (entrada === '' && saida === '') {
      toast.error('Preencha a data de entrada e saída!')
    } else {
      setHotel(id)
    }
  }

  function mascaraMoeda(event) {
    const campo = event.target;
    const tecla = event.which || window.event.keyCode;
    const valor = campo.value.replace(/[^\d]+/gi, '').split('').reverse();
    let resultado = '';
    const mascara = '########.##'.split('').reverse();
  
    for (let x = 0, y = 0; x < mascara.length && y < valor.length;) {
      if (mascara[x] !== '#') {
        resultado += mascara[x];
        x++;
      } else {
        resultado += valor[y];
        y++;
        x++;
      }
    }
  
    campo.value = resultado.split('').reverse().join('');
  }
  


  return (
    <div style={{ backgroundColor: '#f3f3f3' }}>
      <div style={{ display: 'flex' }}>
        <Menu parametro={'1'} />
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <h1>Adicionar Check-in</h1>
                <p className="breadcrumbs">
                  <span>
                    <Link href="/b2b">Dashboard</Link>
                  </span>
                  <span>
                    <i className="mdi mdi-chevron-right"></i>
                  </span>
                  Adicionar Check-in
                </p>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card card-default">
                    <div className="card-body">
                      <div className="row ec-vendor-uploads">
                        <div className="col-lg-12">
                          <div className="ec-vendor-upload-detail">
                            <form
                              className="row g-3"
                              encType="multipart/form-data"
                            >

                              <div className="col-md-12">
                                <label htmlFor="inputEmail4" className="form-label">
                                  Nome
                                </label>
                                <input
                                  type="text"
                                  className="form-control slug-title"
                                  id="inputEmail4"
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Telefone</label>
                                <input
                                  type="text"
                                  className="form-control slug-title"
                                  id="inputEmail4"
                                  onChange={(e) => setTelefone(e.target.value)}
                                />
                              </div>

                              <div className="col-md-6">
                                <label className="form-label">RG</label>
                                <input
                                  type="text"
                                  className="form-control slug-title"
                                  id="inputEmail4"
                                  onChange={(e) => setRg(e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">CPF</label>
                                <input
                                  type="text"
                                  className="form-control slug-title"
                                  id="inputEmail4"
                                  value={formatCpf(cpf)}
                                  onChange={(e) => setCpf(e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Passaporte</label>
                                <input
                                  type="text"
                                  className="form-control slug-title"
                                  id="inputEmail4"
                                  onChange={(e) => setPassaporte(e.target.value)}
                                />
                              </div>
                              <div className="col-md-6 date-input">
                                <label className="form-label">Data de Nascimento</label>
                                <input
                                  type="date"
                                  className="form-control slug-title"
                                  onChange={(e) => setDatanascimento(e.target.value)}
                                />
                                <span className="calendar-icon"></span>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Genero</label>
                                <div className="input-icon-container">
                                  <select style={{ height: '46px' }} onChange={(e) => setGenero(e.target.value)}>
                                    <option value={''} selected></option>
                                    <option value={'masculino'} >Masculino</option>
                                    <option value={'feminino'}>Feminino</option>
                                    <option value={'outros'}>Outros</option>
                                  </select>
                                </div>
                              </div>
                              {/* <div className="col-md-6 space-t-15 mt-3">
                                <label htmlFor="phone-2" className="form-label">
                                  Ultimo dia de limpeza
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="phone-2"
                                  value={entrada}
                                  disabled
                                  onChange={(e) => setGenero(e.target.value)}
                                />
                              </div> */}
                              <div className="col-md-12">
                                <label className="form-label">Observações</label>
                                <textarea
                                  rows={5}
                                  className="slug-title"
                                  id="inputEmail4"
                                  onChange={(e) => setObservações(e.target.value)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">Valor da Diaria</label>
                                
                                <input
                                    id="text"
                                    name="valor"
                                    className="form-control here slug-title"
                                    type="text"
                                    value={`R$ ${valordiaria}`}
                                    onChange={(e) => {mascaraMoeda(e), setValordiaria(e.target.value) }}
                                  />
                              </div>

                              <div className="col-md-6">
                                <label htmlFor="phone-2" className="form-label">
                                  Valor Pago
                                </label>
                                <input
                                    id="text"
                                    name="valor"
                                    className="form-control here slug-title"
                                    type="text"
                                    value={`R$ ${valorpago}`}
                                    onChange={(e) => {mascaraMoeda(e), setValorpago(e.target.value) }}
                                  />
                              </div>
                              <div className="col-md-12">
                                <label className="form-label">Forma de Pagamento</label>
                                <div className="input-icon-container">
                                  <select onChange={(e) => setFormaPagamento(e.target.value)}>
                                    <option value={''} selected></option>
                                    <option value={'dinheiro'}>Dinheiro</option>
                                    <option value={'pix'}>Pix</option>
                                    <option value={'debito'}>Débito</option>
                                    <option value={'credito'}>Crédito</option>
                                    <option value={'cheque'}>Cheque</option>
                                  </select>
                                </div>
                              </div>

                              <div className="col-md-6 date-input">
                                <label className="form-label">Entrada</label>
                                <input
                                  type="date"
                                  className="form-control slug-title"
                                  value={entrada}
                                  onChange={(e) => datamudou(e.target.value, 'entrada')}
                                />
                                <span className="calendar-icon"></span>
                              </div>
                              <div className="col-md-6 date-input">
                                <label className="form-label">Saida</label>
                                {entrada === '' ?
                                  <input
                                    type="date"
                                    className="form-control slug-title"
                                    disabled
                                    value={saida}
                                    onChange={(e) => datamudou(e.target.value, 'saida')}
                                  />
                                  :
                                  <input
                                    type="date"
                                    className="form-control slug-title"
                                    value={saida}
                                    onChange={(e) => datamudou(e.target.value, 'saida')}
                                  />}
                                  <span className="calendar-icon"></span>

                              </div>



                              <h3 className="text-center mb-2"> Escolha o Hotel </h3>
                              <div className="col-md-12 d-flex flex-wrap justify-content-around">
                                {hoteis?.map((item, index) => {
                                  return (
                                    <div key={index} className={`col-md-5 mb-3`} style={{ position: 'relative', height: '150px', overflow: 'hidden', background: `url(${item.imagem[0].url})` }}>
                                      <div className={`circulohotel d-flex flex-column ${hotel === item._id ? 'backgroundactive' : ''}`} style={{ position: 'absolute', fontWeight: '700' }} onClick={() => verificar(item._id)}>
                                        <div className="text-center" style={{ background: '#000000a1', padding: '12px', borderRadius: '5px' }}>
                                          {item.titulo}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>

                              {hotel.length > 0 ?
                                <>
                                  <h3 className="text-center mt-3"> Escolha o Quarto </h3>
                                  <div className="col-md-12 d-flex justify-content-center">
                                    {quartos?.map((item, index) => {

                                      const dataEntradaNovaReserva = new Date(entrada);
                                      const dataSaidaNovaReserva = new Date(saida);

                                      if (item.hotel === hotel) {
                                        let counting = 0;
                                        return (
                                          <>
                                            <div key={index} className="col-md-3 m-2" style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                                              <div className={`circuloquarto d-flex flex-column ${idquarto === item._id ? 'backgroundactive2' : ''}`} style={{ position: 'absolute', fontWeight: '700', backgroundImage: `url(${item.imagem[0].url})` }} onClick={() => { setQuarto(item.arrCamas), setNomeQuarto(item.titulo), setIdquarto(item._id) }}>
                                                <div className="text-center" style={{ background: '#000000a1', padding: '12px', borderRadius: '5px' }}>
                                                  {item.titulo}
                                                  <div>{item.genero} </div>
                                                  <div>Total de camas: {item.camas} </div>
                                                  <div>Oculpados: {
                                                    item.arrCamas?.map((item2, index) => {
                                                      item2?.map((item5, index) => {
                                                        const dataEntradaNovaReserva = new Date(entrada);
                                                        const dataSaidaNovaReserva = new Date(saida);
                                                        const dataEntradaReserva = new Date(item5.entrada);
                                                        const dataSaidaReserva = new Date(item5.saida);
                                                        const quartoVago = (dataEntradaNovaReserva <= dataSaidaReserva && dataSaidaNovaReserva >= dataEntradaReserva);
                                                        if (quartoVago) {
                                                          counting++;
                                                        }
                                                      })
                                                    })
                                                  } {counting}</div>
                                                </div>
                                              </div>
                                            </div>

                                          </>
                                        )
                                      }
                                    })}
                                  </div>
                                </>
                                :
                                <></>
                              }


                              {quarto.length > 0 ? (
                                <>
                                  <h3 className="text-center mt-3 mb-2">{nomequarto}</h3>
                                  <div className="col-12 d-flex justify-content-center mb-3">
                                    <div
                                      className="col-12 d-flex justify-content-center align-items-center flex-wrap"
                                      style={{ padding: "40px", border: "3px solid black", maxWidth: '90%' }}
                                    >
                                      {quarto?.map((item2, index) => (
                                        <>
                                          {item2?.map((item3, index) => {
                                            let contadorcamas = 0;
                                            let contadorunico = 0;
                                            let contadorsaida = 0;

                                            const dataEntradaNovaReserva = new Date(entrada);
                                            const dataSaidaNovaReserva = new Date(saida);
                                            const dataEntradaReserva = new Date(item3.entrada);
                                            const dataSaidaReserva = new Date(item3.saida);
                                            const quartoVago = (dataEntradaNovaReserva <= dataSaidaReserva && dataSaidaNovaReserva >= dataEntradaReserva);





                                            if (item3.base === false && item3.vago === true) {
                                              contadordisponivel++;
                                            }

                                            if (item2.length > 1) {
                                              if (item3.base === true) {
                                                contadorcamas++;
                                              }
                                              if (!quartoVago) {
                                                contadorcamas++;
                                              }
                                            }
                                            if (item2.length > 1 && item3.base === true) {
                                              let verdadeiro = false;
                                              item2?.map((item5, index) => {
                                                const dataEntradaReservanew = new Date(item5.entrada);
                                                const dataSaidaReservannew = new Date(item5.saida);
                                                const quartoVagonew = (dataEntradaNovaReserva < dataSaidaReservannew && dataSaidaNovaReserva > dataEntradaReservanew);


                                                if (quartoVagonew) {
                                                  verdadeiro = true;
                                                }
                                                if (item2.length === index + 1 && verdadeiro === false) {
                                                  contadorunico++;
                                                }
                                              })
                                            }
                                            if (contadorcamas === 0) {
                                              return (
                                                <>
                                                  {quartoVago ? (
                                                    <div
                                                      style={{ position: "relative" }}
                                                      className="mb-6"
                                                      key={`quarto-${item3.numeroCama}`}
                                                    >
                                                      <Image
                                                        width={70}
                                                        height={70}
                                                        className="pl-3 pr-3"
                                                        style={{ opacity: "0.5" }}
                                                        src={require("../../assets/img/cama-de-solteiro.png")}
                                                      />
                                                      {contadorsaida > 0 ?
                                                        <div
                                                          className="circulocama d-flex flex-column"
                                                          style={{
                                                            position: "absolute",
                                                            fontWeight: "700",
                                                            width: '80px',
                                                            height: '75px',
                                                            background: "rgb(200, 229, 255)",
                                                          }}
                                                          onClick={() => { registrarQuarto(item3.numeroCama), setNumerocama(item3.numeroCama), toast.error('registrado'), setArrdatas(item2) }}
                                                        >
                                                          {item3.numeroCama}
                                                          <p>{item3.vago ? item3.hospede : "Liberado"}</p>
                                                          <p>{item3.entrada}</p>
                                                          <p>{item3.saida}</p>
                                                          <p>{contadorsaida > 0 ? 'Saida as 12Hrs' : ''}</p>
                                                        </div>
                                                        :
                                                        <div
                                                          className="circulocama d-flex flex-column mb-6"
                                                          style={{
                                                            position: "absolute",
                                                            fontWeight: "700",
                                                            width: '100px',
                                                            color: 'white',
                                                            background: "#d83b3b",
                                                          }}
                                                          onClick={() => toast.error("Já reservado")}
                                                        >
                                                          {item3.numeroCama}
                                                          <p style={{ color: 'white', fontWeight: 'bold' }}>{item3.vago ? `${item3.hospede.slice(0, 10)}...` : "Liberado"}</p>
                                                          <p style={{ color: 'white', fontWeight: 'bold' }}>{item3.entrada}</p>
                                                          <p style={{ color: 'white', fontWeight: 'bold' }}>{item3.saida}</p>
                                                          <p style={{ color: 'white', fontWeight: 'bold' }}>{contadorsaida > 0 ? 'Saida as 12Hrs' : ''}</p>
                                                        </div>}

                                                    </div>
                                                  ) : (
                                                    <div
                                                      style={{ position: "relative" }}
                                                      className="mb-6"
                                                      key={`quarto-${item3.numeroCama}`}
                                                    >
                                                      <Image
                                                        width={70}
                                                        height={70}
                                                        className="pl-3 pr-3"
                                                        style={{ opacity: "0.5" }}
                                                        src={require("../../assets/img/cama-de-solteiro.png")}
                                                      />
                                                      <div
                                                        className={`${objreserva.cama === item3.numeroCama ? "backgroundactive2" : ""
                                                          } circulocama d-flex flex-column`}
                                                        style={{
                                                          position: "absolute", fontWeight: "700", width: '80px',
                                                          height: '75px',
                                                        }}
                                                        onClick={() => { registrarQuarto(item3.numeroCama), setNumerocama(item3.numeroCama), setArrdatas(item2) }}
                                                      >
                                                        {item3.numeroCama}
                                                        <p>{"Liberado"}</p>
                                                      </div>
                                                    </div>
                                                  )}
                                                </>
                                              )
                                            } else if (contadorunico > 0) {
                                              return (
                                                <>
                                                  {quartoVago ? (
                                                    <div
                                                      style={{ position: "relative" }}
                                                      className="mb-6"
                                                      key={`quarto-${item3.numeroCama}`}
                                                    >
                                                      <Image
                                                        width={70}
                                                        height={70}
                                                        className="pl-3 pr-3"
                                                        style={{ opacity: "0.5" }}
                                                        src={require("../../assets/img/cama-de-solteiro.png")}
                                                      />
                                                      <div
                                                        className="circulocama d-flex flex-column"
                                                        style={{
                                                          position: "absolute",
                                                          fontWeight: "700",
                                                          width: '100px',
                                                          background: "#d83b3b",
                                                          color: 'white'
                                                        }}
                                                        onClick={() => toast.error("Já reservado")}
                                                      >
                                                        {item3.numeroCama}
                                                        <p>{item3.vago ? item3.hospede.slice(0, 10) : "Liberado"}</p>
                                                        <p>{item3.entrada}</p>
                                                        <p>{item3.saida}</p>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <div
                                                      style={{ position: "relative" }}
                                                      className="mb-6"
                                                      key={`quarto-${item3.numeroCama}`}
                                                    >
                                                      <Image
                                                        width={70}
                                                        height={70}
                                                        className="pl-3 pr-3"
                                                        style={{ opacity: "0.5" }}
                                                        src={require("../../assets/img/cama-de-solteiro.png")}
                                                      />
                                                      <div
                                                        className={`${objreserva.cama === item3.numeroCama ? "backgroundactive2" : ""
                                                          } circulocama d-flex flex-column`}
                                                        style={{
                                                          position: "absolute", fontWeight: "700",
                                                          width: '80px',
                                                          height: '75px',
                                                        }}
                                                        onClick={() => { registrarQuarto(item3.numeroCama), setNumerocama(item3.numeroCama), setArrdatas(item2) }}
                                                      >
                                                        {item3.numeroCama}
                                                        <p>{"Liberado"}</p>
                                                      </div>
                                                    </div>
                                                  )}
                                                </>
                                              )
                                            }
                                          })}


                                        </>
                                      )
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}

                              <Calendario arrdatas={arrdatas} />


                              {/* <div className="d-flex mb-3 col-md-6 justify-content-center mt-4">
                                <div className="row align-items-center justify-content-center text-center">
                                  <label className="form-label">Ativado</label>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    <input
                                      type="radio"
                                      name="active"
                                      value={1}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                    Sim
                                  </div>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    <input
                                      type="radio"
                                      name="active"
                                      value={0}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                    Não
                                  </div>
                                </div>
                              </div> */}

                              <div className="d-flex mb-3 col-md-12 justify-content-center mt-4">
                                <div className="row align-items-center justify-content-center text-center">
                                  <label className="form-label">Pagamento Concluído</label>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    <input
                                      type="radio"
                                      name="pagamento"
                                      value={1}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setPagamentoConcluido(e.target.value)}
                                    />
                                    Sim
                                  </div>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    <input
                                      type="radio"
                                      name="pagamento"
                                      value={0}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setPagamentoConcluido(e.target.value)}
                                    />
                                    Não
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div onClick={() => dispararbanco()} className="btn btn-primary">
                                  Adicionar Check-in
                                </div>
                              </div>
                            </form>
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
      </div>
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
}