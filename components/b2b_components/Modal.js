import { useState, useEffect } from "react";
import useSwr, { mutate } from "swr";
import router from 'next/router';
const fetcher = (url) => fetch(url).then((res) => res.json());
import Image from 'next/image'
import Swal from 'sweetalert2'
import Calendario from '../../components/b2b_components/Calendario'
import axios from "axios";
import { toast } from "react-toastify";
import CurrencyInput from 'react-currency-input-field'
import formatCpf from '@brazilian-utils/format-cpf';
import { useCookies, expires } from 'react-cookie';
import { differenceInDays, parseISO } from 'date-fns';
export default function Modal({ customers, id_ }) {
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const { data: quartos } = useSwr(`/api/quartos/getAllQuarto`, fetcher);
  const { data: hospedes } = useSwr(`/api/hospedes/getAllHospedes`, fetcher);
  const [arrdatas, setArrdatas] = useState();
  const [Name, setName] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [passaporte, setPassaporte] = useState("");
  const [entrada, setEntrada] = useState("")
  const [saida, setSaida] = useState("")
  const [saidafixa, setSaidafixa] = useState("")
  const [saidamanha, setSaidamanha] = useState("")
  const [datanascimento, setDatanascimento] = useState("")
  const [telefone, setTelefone] = useState("")
  const [formapagamento, setFormaPagamento] = useState("")
  const [observacoes, setObservações] = useState("")
  const [diaLimpeza, setDiaLimpeza] = useState("")
  const [cama, setCama] = useState("")
  const [valorpago, setValorpago] = useState(0)
  const [valordiaria, setValordiaria] = useState(0)
  const [hotel, setHotel] = useState("");
  const [quarto, setQuarto] = useState([]);
  const [nomequarto, setNomeQuarto] = useState('');
  const [numerocama, setNumerocama] = useState('');
  const [genero, setGenero] = useState("");
  const [idquarto, setIdquarto] = useState("");
  const [idquartodef, setIdquartodef] = useState("");
  const [objreserva, setObjreserva] = useState([]);
  const [active, setActive] = useState('');
  const [pagamentoconcluido, setPagamentoConcluido] = useState('');
  const [checkinID, setCheckingID] = useState(0);
  const [camacheckinID, setCamaCheckinID] = useState(0);
  const [usuario, setUsuario] = useState('');
  const [abertpor, setAbertopor] = useState("");
  const [rgfrente, setRgfrente] = useState("");
  const [rgverso, setRgverso] = useState("");
  const [assinatura, setAssinatura] = useState("");
  const currentDate = new Date(saida);
  const previousDate = new Date(currentDate.setDate(currentDate.getDate()) - 1);
  let newarr = [];
  useEffect(() => {
    customers?.map((item, index) => {
      hospedes?.map((item5, index) => {
        if (item._id === id_) {
            if(item5.cpf === item.cpf){
            setRgfrente(item5.rgfrente)
            setRgverso(item5.rgverso)
            setAssinatura(item5.assinatura)
            }
            setPagamentoConcluido(item.pagamentoconcluido)
            setActive(item.ativado)
            setObjreserva(item.objreserva)
            setValordiaria(item.valordiaria)
            setValorpago(item.valorpago)
            setObservações(item.observacoes)
            setFormaPagamento(item.formapagamento)
            setTelefone(item.telefone)
            setDiaLimpeza(item.diaLimpeza)
            setDatanascimento(item.datanascimento)
            setSaida(item.saida)
            setSaidafixa(item.saida)
            setEntrada(item.entrada)
            setPassaporte(item.passaporte)
            setCpf(item.cpf)
            setSaidamanha(item.saidamanha)
            setRg(item.rg)
            setName(item.nome)
            setGenero(item.genero)
            setHotel(item.objreserva.hotel)
            setIdquarto(item.objreserva.quarto)
            setNumerocama(item.objreserva.cama)
            setCama(item.objreserva.cama)
            setCheckingID(item.checkinID)
            setUsuario(item.usuario)
            setAbertopor(item.acesso_comanda)
            quartos?.map((item2, index) => {
              if (item.objreserva.quarto === item2._id) {
                setQuarto(item2.arrCamas)
                setIdquarto(item2._id)
                setIdquartodef(item2._id)
                item2.arrCamas?.map((item3, index) => {
                  item3?.map((item4, index5) => {
    
                    if (item.checkinID === item4.checkinID) {
                      newarr = [...newarr, item4];
                      setCamaCheckinID(item4.checkinID)
                    }
                    if (item3.length === index5 + 1) {
                      setArrdatas(newarr)
                    }
                  })
                })
              }
            })
          }
        
    })})
  }, [id_])

  let somatoria = calcularDiferencaDias(entrada, saidamanha) * valordiaria;
  function calcularDiferencaDias(dataInicio, dataFim) {
    const inicio = parseISO(dataInicio);
    const fim = parseISO(dataFim);
    const diferenca = differenceInDays(fim, inicio);
    
    return diferenca;
  }

  let contadordisponivel = 0;
  let contadorrenderizado = 0;
  let titulo_ = '';
  let camas = '';
  let arrCamas = [];
  let imagem = [];
  let hotel_ = '';
  let genero_ = '';
  let ativado = '';
  let titulo_2 = '';
  let camas2 = '';
  let arrCamas2 = [];
  let imagem2 = [];
  let hotel_2 = '';
  let genero_2 = '';
  let ativado2 = '';

  const registrarQuarto = (numerocama) => {
    console.log(previousDate.toISOString().slice(0, 10));
    setObjreserva({
      hotel: hotel,
      quarto: idquarto,
      cama: numerocama,
    })
  }



  const dispararcheckin = async () => {
    let diasaida = '';
    let diasaidamanha = '';
    if (saida === saidafixa) { diasaida = saidafixa } else { diasaida = previousDate.toISOString().slice(0, 10) }
    if (saida === saidafixa) { diasaidamanha = saidamanha } else { diasaidamanha = saida }
    let data = await axios.put(`/api/checkin/updateCheckin?id=${id_}`, {
      nome: Name,
      rg: rg,
      cpf: cpf,
      passaporte: passaporte,
      datanascimento: datanascimento,
      telefone: telefone,
      genero: genero,
      entrada: entrada,
      diaLimpeza: entrada,
      saidamanha: diasaidamanha,
      saida: diasaida,
      formapagamento: formapagamento,
      valorpago: parseFloat(valorpago),
      valordiaria: parseFloat(valordiaria),
      observacoes: observacoes,
      objreserva: objreserva,
      ativado: active,
      pagamentoconcluido: pagamentoconcluido,
      checkinID: checkinID,
      usuario: usuario,
      acesso_comanda: abertpor,
    });
    mutate('/api/hoteis/getAllCustomers')
  }
  const dispararcheckoutaxios = async () => {
    let diasaida = '';
    let diasaidamanha = '';
    if (saida === saidafixa) { diasaida = saidafixa } else { diasaida = previousDate.toISOString().slice(0, 10) }
    if (saida === saidafixa) { diasaidamanha = saidamanha } else { diasaidamanha = saida }
    let data = await axios.put(`/api/checkin/updateCheckin?id=${id_}`, {
      nome: Name,
      rg: rg,
      cpf: cpf,
      passaporte: passaporte,
      datanascimento: datanascimento,
      telefone: telefone,
      genero: genero,
      entrada: entrada,
      diaLimpeza: entrada,
      saidamanha: diasaidamanha,
      saida: diasaida,
      formapagamento: formapagamento,
      valorpago: parseFloat(valorpago),
      valordiaria: parseFloat(valordiaria),
      observacoes: observacoes,
      objreserva: objreserva,
      ativado: '0',
      pagamentoconcluido: pagamentoconcluido,
      checkinID: checkinID,
      usuario: usuario,
      acesso_comanda: abertpor,
    });
    mutate('/api/hoteis/getAllCustomers')
  }
  const dispararcheckoutatt = async () => {
    let diasaida = '';
    let diasaidamanha = '';
    toast.success('Atualizando estadia.')
    if (saida === saidafixa) { diasaida = saidafixa } else { diasaida = previousDate.toISOString().slice(0, 10) }
    if (saida === saidafixa) { diasaidamanha = saidamanha } else { diasaidamanha = saida }
    setTimeout(() => {
      router.reload();
    }, 2000)
    let data = await axios.put(`/api/checkin/updateCheckin?id=${id_}`, {
      nome: Name,
      rg: rg,
      cpf: cpf,
      passaporte: passaporte,
      datanascimento: datanascimento,
      telefone: telefone,
      genero: genero,
      entrada: entrada,
      diaLimpeza: entrada,
      saidamanha: diasaidamanha,
      saida: diasaida,
      formapagamento: formapagamento,
      valorpago: parseFloat(valorpago),
      valordiaria: parseFloat(valordiaria),
      observacoes: observacoes,
      objreserva: objreserva,
      ativado: '0',
      pagamentoconcluido: pagamentoconcluido,
      checkinID: checkinID,
      usuario: usuario,
      acesso_comanda: abertpor,

    });
    mutate('/api/checkin/getAllCheckin')
  }
  const dispararquarto = async () => {
    const response1 = await axios.put(`/api/quartos/updateQuarto?id=${idquarto}`, {
      titulo: titulo_,
      camas: camas,
      arrCamas: arrCamas,
      imagem: imagem,
      hotel: hotel_,
      genero: genero_,
      ativado: ativado,
    });
    mutate('/api/quartos/getAllQuarto')
  }
  const dispararquartoanterior = async () => {
    setTimeout(() => {
      router.reload();
    }, 2000)
    const response1 = await axios.put(`/api/quartos/updateQuarto?id=${idquartodef}`, {
      titulo: titulo_2,
      camas: camas2,
      arrCamas: arrCamas2,
      imagem: imagem2,
      hotel: hotel_2,
      genero: genero_2,
      ativado: ativado2,
    });
    
    mutate('/api/quartos/getAllQuarto')
  }

  const dispararcheckout = async () => {
    let contador = 0;
    let block = 0;
    const dataEntradaNovaReserva = new Date(entrada);
    const dataSaidaNovaReserva = new Date(saida);

    quartos?.map((item, index) => {
      contador++
      if (item._id === idquarto) {
        item.arrCamas?.map((item2, index) => {
          let contadorcamas = 0;
          let spliceonce = 0;


          item2?.map((item3, index2) => {

            if (item3.numeroCama === numerocama && contadorcamas === 0) {
              if (block === 0) {
                if (item3.checkinID === checkinID) {
                } else {
                  const dataEntradaNovaReserva = new Date(entrada);
                  const dataSaidaNovaReserva = new Date(saida);
                  const dataEntradaReserva = new Date(item3.entrada);
                  const dataSaidaReserva = new Date(item3.saida);
                  const indexblock = item2.findIndex(item3 => dataEntradaNovaReserva < dataSaidaReserva && dataSaidaNovaReserva > dataEntradaReserva);
                  if (indexblock !== -1) {
                    toast.error('ja reservado')
                    block++;
                  }
                }

              }
              if (item2.length === index2 + 1 && block === 0) {
                if (spliceonce === 0) {
                  hoteis?.map((item, index) => {
                    quartos?.map((item7, index) => {
                      item7.arrCamas?.map((item8, index) => {
                        item8?.map((item9, index2) => {
                          if (item9.checkinID === camacheckinID) {
                            const indexsplice = item8.findIndex(item5 => item5.checkinID === checkinID);
                            if (indexsplice !== -1) {
                              item8.splice(indexsplice, 1);
                            }
                            if (hotel === item7.hotel) {
                              titulo_2 = item7.titulo;
                              camas2 = item7.camas;
                              arrCamas2 = item7.arrCamas;
                              imagem2 = item7.imagem;
                              hotel_2 = item7.hotel;
                              genero_2 = item7.genero;
                              ativado2 = item7.ativado;
                            }
                          }
                        })
                      })
                    })
                  })

                  spliceonce++;
                }
                if (spliceonce > 0) {
                  contadorcamas++;
                  // item2.push({   
                  //   numeroCama: numerocama,
                  //   vago: true,
                  //   hospede: Name,
                  //   limpeza: entrada,
                  //   entrada: entrada,
                  //   saida: saida,
                  //   base: false,
                  //   checkinID: checkinID,
                  // })
                  titulo_ = item.titulo;
                  camas = item.camas;
                  arrCamas = item.arrCamas;
                  imagem = item.imagem;
                  hotel_ = item.hotel;
                  genero_ = item.genero;
                  ativado = item.ativado;
                }
              }

            }
          })
        })
      }
    })

    if (quartos.length === contador && block === 0) {

      try {
        toast.success('Atualizando estadia.')
        dispararcheckoutaxios()

        dispararquarto()

        dispararquartoanterior()

        // Executa a segunda solicitação apenas se a primeira for concluída com sucesso
        setTimeout(() => {
          router.reload();
        }, 2000)
      } catch (error) {
        console.error(error);
      }
    }

  }
  const dispararbanco = async () => {
    let contador = 0;
    let block = 0;
    const dataEntradaNovaReserva = new Date(entrada);
    const dataSaidaNovaReserva = new Date(saida);


    quartos?.map((item, index) => {
      contador++
      if (item._id === idquarto) {
        item.arrCamas?.map((item2, index) => {
          let contadorcamas = 0;
          let spliceonce = 0;


          item2?.map((item3, index2) => {

            if (item3.numeroCama === numerocama && contadorcamas === 0) {
              if (block === 0) {
                if (item3.checkinID === checkinID) {
                  console.log('pass')
                } else {
                  const dataEntradaNovaReserva = new Date(entrada);
                  const dataSaidaNovaReserva = new Date(saida);
                  const dataEntradaReserva = new Date(item3.entrada);
                  const dataSaidaReserva = new Date(item3.saida);
                  const indexblock = item2.findIndex(item3 => dataEntradaNovaReserva <= dataSaidaReserva && dataSaidaNovaReserva >= dataEntradaReserva);
                  if (indexblock !== -1) {
                    toast.error('ja reservado!')
                    block++;
                  }
                }

              }
              if (item2.length === index2 + 1 && block === 0) {
                if (spliceonce === 0) {
                  hoteis?.map((item, index) => {
                    quartos?.map((item7, index) => {
                      item7.arrCamas?.map((item8, index) => {
                        item8?.map((item9, index2) => {
                          if (item9.checkinID === camacheckinID) {
                            const indexsplice = item8.findIndex(item5 => item5.checkinID === checkinID);
                            if (indexsplice !== -1) {
                              item8.splice(indexsplice, 1);
                            }
                            if (hotel === item7.hotel) {
                              titulo_2 = item7.titulo;
                              camas2 = item7.camas;
                              arrCamas2 = item7.arrCamas;
                              imagem2 = item7.imagem;
                              hotel_2 = item7.hotel;
                              genero_2 = item7.genero;
                              ativado2 = item7.ativado;
                            }
                          }
                        })
                      })
                    })
                  })

                  spliceonce++;
                }
                if (spliceonce > 0) {
                  contadorcamas++;
                  item2.push({
                    numeroCama: numerocama,
                    vago: true,
                    hospede: Name,
                    limpeza: entrada,
                    entrada: entrada,
                    saida: saidamanha,
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
              }

            }
          })
        })
      }
    })

    if (quartos.length === contador && block === 0) {

      try {
        toast.success('Atualizando estadia.')
        dispararquarto()
        dispararcheckin()
        dispararquartoanterior()
      

        // Executa a segunda solicitação apenas se a primeira for concluída com sucesso

      } catch (error) {
        console.error(error);
      }
    }

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
    if (saida === '' && parametro === 'saida') {
      setSaida(valor)
      setSaidamanha(valor)
      return
    }
    if (valor <= saida || entrada <= valor && entrada !== '' && saida !== '') {
      if (parametro === 'entrada' && valor < saida) {
        setEntrada(valor)
        return
      } else if (parametro === 'saida' && entrada < valor) {
        setSaida(valor)
        setSaidamanha(valor)
        return
      } else { toast.error('Saída maior que entrada') }
    } else {
      toast.error('Saída maior que entrada')
    }

  }

  const temcerteza = () => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Ao confirmar o check-out sera realizado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Realiza Check-out!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispararcheckout();
      }
    })
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
    <div className="modal fade" id="edit_modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderRadius: "6px" }}>
          <div className="modal-body">
            <div className="row">
              <div className="ec-vendor-block-img space-bottom-30">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>Check-in</h5>
                  </div>
                  <div>
                    <div
                      className="btn btn-sm btn-primary qty_close"
                      style={{ width: '80px', background: '#D83B3B' }}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Fechar
                    </div>
                  </div>
                </div>
                <div className="ec-vendor-upload-detail">
                  {customers?.map((item, index) => {
                    if (item._id === id_) {
                      return (
                        <form className="row g-3" key={item.id}>
                          <div className="col-md-12 space-t-15 mt-3">
                            <label htmlFor="first-name" className="form-label">
                              Nome
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={Name}
                              onChange={(e) => setName(e.target.value)}
                              id="first-name"
                            />
                          </div>


                          <div className="col-md-6 col-12 space-t-15 d-flex justify-content-between mt-3">
                            <div className="col-md-12 col-12">
                              <label htmlFor="email" className="form-label">
                                Telefone
                              </label>
                              <input type="text" value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                className="form-control" id="email" />
                            </div>
                          </div>

                          <div className="col-md-6 space-t-15 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              RG
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={rg}
                              onChange={(e) => setRg(e.target.value)}
                              id="phone-1"
                            />
                          </div>

                          <div className="col-md-6 space-t-15 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              CPF
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={formatCpf(cpf)}
                              id="phone-1"
                              onChange={(e) => setCpf(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6 space-t-15 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              Passaporte
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={passaporte}
                              id="phone-1"
                              onChange={(e) => setPassaporte(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6 space-t-15 mt-3 date-input">
                            <label htmlFor="phone-2" className="form-label">
                              Nascimento
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              value={datanascimento}
                              id="phone-2"
                              onChange={(e) => setDatanascimento(e.target.value)}
                            />
                            <span className="calendar-icon"></span>
                          </div>
                          <div className="col-md-6 space-t-15 mt-3">
                            <label className="form-label">Genero</label>
                            <select className="form-control" value={genero} onChange={(e) => setGenero(e.target.value)}>
                              <option value={''} selected></option>
                              <option value={'masculino'} selected>Masculino</option>
                              <option value={'feminino'}>Feminino</option>
                              <option value={'outros'}>Outros</option>

                            </select>
                          </div>
                          {/* <div className="col-md-6 space-t-15 mt-3">
                            <label htmlFor="phone-2" className="form-label">
                              Ultimo dia de limpeza
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              value={diaLimpeza}
                              id="phone-2"
                              onChange={(e) => setDiaLimpeza(e.target.value)}
                            />
                          </div> */}
                          <div className="col-md-12">
                            <label className="form-label">Observações</label>
                            <textarea
                              rows={5}
                              className="slug-title"
                              id="inputEmail4"
                              value={observacoes}
                              onChange={(e) => setObservações(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6 space-t-15 mt-3">
                            <label htmlFor="phone-2" className="form-label">
                              Valor da Diaria
                            </label>
                            <input
                              id="text"
                              name="valor"
                              className="form-control here slug-title"
                              type="text"
                              value={`R$ ${valordiaria}`}
                              onChange={(e) => { mascaraMoeda(e), setValordiaria(e.target.value) }}
                            />
                          </div>
                          <div className="col-md-6 space-t-15 mt-3">
                            <label htmlFor="phone-2" className="form-label">
                              Valor Pago
                            </label>
                            <input
                              id="text"
                              name="valor"
                              className="form-control here slug-title"
                              type="text"
                              value={`R$ ${valorpago}`}
                              onChange={(e) => { mascaraMoeda(e), setValorpago(e.target.value) }}
                            />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Forma de Pagamento</label>
                            <select className="form-control" value={formapagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                              <option value={''} selected></option>
                              <option value={'dinheiro'} >Dinheiro</option>
                              <option value={'pix'} >Pix</option>
                              <option value={'debito'}>Débito</option>
                              <option value={'credito'}>Crédito</option>
                              <option value={'cheque'}>Cheque</option>
                            </select>
                          </div>
                          <div className="col-md-6 space-t-15 mt-3 date-input">
                            <label htmlFor="phone-2" className="form-label">
                              Entrada
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              value={entrada}
                              id="phone-2"
                              onChange={(e) => datamudou(e.target.value, 'entrada')}
                            />
                            <span className="calendar-icon"></span>
                          </div>
                          <div className="col-md-6 space-t-15 mt-3 date-input">
                            <label htmlFor="phone-2" className="form-label">
                              Saída
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              value={saidamanha}
                              id="phone-2"
                              onChange={(e) => datamudou(e.target.value, 'saida')}
                              />
                            <span className="calendar-icon"></span>
                          </div>

                          <div className="col-md-12 date-input text-center mb-3 mt-3">
                              <h5>Valor Total: R${somatoria ? somatoria.toFixed(2) : 'Esperando dados...'}</h5>
                              </div>

                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              RG Frente
                            </label>
                            {rgfrente && (
                              <img className="tramanhodocumento" src={rgfrente.url} alt="RG Frente" />
                            )}

                          </div>
                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              RG Verso
                            </label>
                            {rgverso && (
                              <img className="tramanhodocumento" src={rgverso.url} alt="RG Verso" />
                            )}
                          </div>
                          <div className="col-12 d-flex justify-content-center">
                            <div className="col-md-4 mt-3">
                              <label htmlFor="phone-1" className="form-label text-center w-100">
                                Assinatura
                              </label>
                              {assinatura && (
                                <img className="tramanhodocumento" src={assinatura.url} alt="RG Verso" />
                                )}
                            </div>
                          </div>

                          <h3 className="text-center mb-2 mt-4"> Escolha o Hotel </h3>
                          <div className="col-md-12 d-flex flex-wrap justify-content-around">
                            {hoteis?.map((item, index) => {
                              if(hotel === item._id){
                                return (
                                  <div key={index} className={`col-md-5 col-12 mb-3`} style={{ position: 'relative', height: '240px', overflow: 'hidden', background: `url(${item.imagem[0].url})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                                    <div className={`circulohotel d-flex flex-column ${hotel === item._id ? 'backgroundactive' : ''}`} style={{ position: 'absolute', fontWeight: '700' }} onClick={() => toast.error('não é possivel trocar de Hostel!')}>
                                      {item.titulo}
  
                                    </div>
                                  </div>
                                )
                              }
                            })}
                          </div>

                          {hotel.length > 0 ?
                            <>
                              <h3 className="text-center mt-3"> Escolha o Quarto </h3>
                              <div className="col-md-12 col-12 d-flex justify-content-center" style={{ flexWrap: 'wrap' }}>
                                {quartos?.map((item, index) => {

                                  const dataEntradaNovaReserva = new Date(entrada);
                                  const dataSaidaNovaReserva = new Date(saida);

                                  if (item.hotel === hotel) {
                                    let counting = 0;
                                    return (
                                      <>
                                        <div key={index} className="col-md-3 col-12 m-2" style={{ position: 'relative', height: '210px', overflow: 'hidden', flexWrap: 'wrap' }}>
                                              <div className={`circuloquarto d-flex flex-column ${idquarto === item._id ? 'backgroundactive2' : ''}`} style={{ position: 'absolute', fontWeight: '700', backgroundImage: `url(${item.imagem[0].url})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} onClick={() => { setQuarto(item.arrCamas), setNomeQuarto(item.titulo), setIdquarto(item._id) }}>
                                                <div className="text-center" style={{ background: '#000000a1', padding: '12px', borderRadius: '5px', width: '200px' }}>
                                                  <div style={{ fontSize: '18px', fontWeight: '800' }}>{item.titulo}</div>
                                                  <div style={{ fontSize: '16px', fontWeight: '800', padding: '5px' }} className="d-flex justify-content-between">
                                                    <div className="col-lg-9" style={{ background: '#41AEC6', borderRadius: '5px', padding: '4px' }} >CAMAS:</div>
                                                    <div style={{ background: 'white', color: 'black', borderRadius: '5px' }} className="col-lg-2 d-flex align-items-center justify-content-center">{item.camas} </div>
                                                  </div>
                                                  <div style={{ fontSize: '16px', fontWeight: '800', padding: '5px' }} className="d-flex justify-content-between"><div style={{ background: '#AF1D23', borderRadius: '5px', padding: '5px' }} className="col-lg-9">OCUPADAS:</div>
                                                    {
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
                                                    } <div style={{ background: 'white', color: 'black', borderRadius: '5px' }} className="col-lg-2 d-flex align-items-center justify-content-center">{counting}</div></div>
                                                  <div style={{ fontSize: '16px', fontWeight: '800', padding: '5px' }} className="d-flex justify-content-between"><div style={{ background: '#00BF63', borderRadius: '5px', padding: '5px' }} className="col-lg-9">LIVRES:</div>
                                                    <div className="col-lg-2 d-flex align-items-center justify-content-center" style={{ background: 'white', color: 'black', borderRadius: '5px' }}>{item.camas - counting}</div>
                                                  </div>
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
                                  {quarto?.map((item2, index) => {

                                    return (
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
                                              const quartoVagonew = (dataEntradaNovaReserva <= dataSaidaReservannew && dataSaidaNovaReserva >= dataEntradaReservanew);

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
                                                        className="circulocama d-flex flex-column"
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
                                                        } circulocama d-flex flex-column mb-6`}
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
                                                        } circulocama d-flex flex-column mb-6`}
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
                                  }
                                  )}
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          <Calendario arrdatas={arrdatas} />

                          {/* {active === '1' ?
                            <div className="d-flex mb-3 col-md-6 justify-content-center mt-4">
                              <div className="row align-items-center justify-content-center text-center">
                                <label className="form-label">Ativado</label>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="active"
                                    value={'1'}
                                    defaultChecked
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setActive(e.target.value)}
                                  />
                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="active"
                                    value={'0'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setActive(e.target.value)}
                                  />
                                  Não
                                </div>
                              </div>
                            </div>
                            :
                            <div className="d-flex mb-3 col-md-6 justify-content-center mt-4">
                              <div className="row align-items-center justify-content-center text-center">
                                <label className="form-label">Ativado</label>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="active"
                                    value={'1'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setActive(e.target.value)}
                                  />
                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="active"
                                    value={'0'}
                                    defaultChecked
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setActive(e.target.value)}
                                  />
                                  Não
                                </div>
                              </div>
                            </div>
                          } */}
                          <div className="d-flex mb-3 col-md-6 justify-content-center align-items-center mt-4">
                            Aberto por: {abertpor}
                          </div>
                          {pagamentoconcluido === '1' ?
                            <div className="d-flex mb-3 col-md-6 justify-content-center mt-4">
                              <div className="row align-items-center justify-content-center text-center">
                                <label className="form-label">Pagamento Concluído</label>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'1'}
                                    defaultChecked
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setPagamentoConcluido(e.target.value)}
                                  />
                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'0'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setPagamentoConcluido(e.target.value)}
                                  />
                                  Não
                                </div>
                              </div>
                            </div>
                            :
                            <div className="d-flex mb-3 col-md-6 justify-content-center mt-4">
                              <div className="row align-items-center justify-content-center text-center">
                                <label className="form-label">Pagamento Concluído</label>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'1'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setPagamentoConcluido(e.target.value)}
                                  />
                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'0'}
                                    defaultChecked
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onClick={(e) => setPagamentoConcluido(e.target.value)}
                                  />
                                  Não
                                </div>
                              </div>
                            </div>
                          }



                          {active === '1' ?
                            <>
                              <div className="col-md-6 space-t-15 mt-4 d-flex justify-content-center text-center">
                                <div
                                  onClick={(e) => dispararbanco()}
                                  className="btn btn-sm btn-primary qty_close"
                                  style={{ width: '250px' }}
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  Atualizar Estadia
                                </div>
                              </div>
                              <div className="col-md-6 space-t-15 mt-4 d-flex justify-content-center text-center">
                                <div
                                  onClick={(e) => temcerteza()}
                                  className="btn btn-sm btn-primary qty_close"
                                  style={{ width: '250px', background: '#D83B3B' }}
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  Check-out
                                </div>
                              </div>
                            </>
                            :
                            <>
                              <div className="col-md-12 space-t-15 mt-4 d-flex justify-content-center text-center">
                                <div
                                  onClick={(e) => dispararcheckoutatt()}
                                  className="btn btn-sm btn-primary qty_close"
                                  style={{ width: '250px', background: '#30AF3B' }}
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                >
                                  Atualizar Check-out
                                </div>
                              </div>
                            </>
                          }

                        </form>
                      )
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
