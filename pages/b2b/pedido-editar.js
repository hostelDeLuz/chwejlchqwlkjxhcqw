import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import useSwr, { mutate } from "swr";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai"

import Image from 'next/image'
import router from 'next/router'
import Menu from "../../components/b2b_components/Menu";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function NovoPedido({ }) {
  const { data: pedidos } = useSwr(`/api/pedidos/getAllPedidos`, fetcher)
  const { data: produtos } = useSwr(`/api/produtos/getAllProdutos`, fetcher);
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const [dataPedido, setDataPedido] = useState("");
  const [comandasPedido, setComandasPedido] = useState("");
  const [produtosPedido, setProdutosPedido] = useState([]);
  const [valorTotalPedido, setValorTotalPedido] = useState(0);
  const [descontoPedido, setDescontoPedido] = useState("");
  const [metodoPedido, setMetodoPedido] = useState("");
  const [pagamentoPedido, setPagamentoPedido] = useState("");
  const [trocoPedido, setTrocoPedido] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [hostel, setHostel] = useState('');
  const [cpf, setCpf] = useState('');
  const [entrada, setEntrada] = useState("");
  const [fechamento, setFechamento] = useState("");
  const [abertpor, setAbertopor] = useState("");
  const [filter, setFilter] = useState([]);
  const [active, setActive] = useState('');
  const [iditem, setIditem] = useState('');

  let hoje = new Date()
  let ano = hoje.getFullYear()
  let mes = hoje.getMonth() + 1
  let dia = hoje.getDate()

  let dataDia = `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;

  const formatter = new Intl.NumberFormat('bt-BR', {
    style: 'currency',
    currency: 'BRL',
  });


  useEffect(() => {
    setIditem(router.query.id)
    setDataPedido(dataDia)
    setFilter(produtos)
  }, [produtos])

  useEffect(() => {
    pedidos?.map((item, index) => {
      if (item._id === router.query.id) {
        setDataPedido(item.data_pedido)
        setComandasPedido(item.comandas)
        setHostel(item.hostel)
        setCpf(item.cpf)
        setEntrada(item.dataentrada)
        setFechamento(item.datafechamento)
        setProdutosPedido(item.produtos)
        setDescontoPedido(item.desconto)
        setValorTotalPedido(item.valor_total)
        setMetodoPedido(item.metodo_pagamento)
        setActive(item.ativo)
        setAbertopor(item.acesso_comanda)
      }
    })
  }, [iditem])

  useEffect(() => {
    let itemObtido;
    setFilter(produtos?.filter(item => {
      return itemObtido = item.nome.toLowerCase().includes(searchItem);
    }));
  }, [searchItem]);

  const onSubmit = async (e) => {
    router.push("/b2b/pedidos-abertos");
    e.preventDefault();
    toast('Pedido editado com sucesso!', {
      position: "top-right",
    });

    produtos?.map((item, index) => {
      produtosPedido?.map((item2, index2) => {
        if (item._id === item2._id) {
          axios.put(`/api/produtos/updateProdutosEstoque?id=${item._id}`, {
            estoque: item.estoque - item2.quantidade,
          });
        }
      })
    })
    let datadefechamento = ''
    if (active === '0') { datadefechamento = new Date() }
    let data = await axios.put(`/api/pedidos/updatePedido?id=${iditem}`, {
      data_pedido: dataPedido,
      comandas: comandasPedido,
      cpf: cpf,
      hostel: hostel,
      dataentrada: entrada,
      datafechamento: datadefechamento,
      ativo: active,
      produtos: produtosPedido,
      desconto: parseFloat(descontoPedido),
      valor_total: parseFloat(valorTotalPedido),
      metodo_pagamento: metodoPedido,
      acesso_comanda: abertpor,
    });
    router.reload();
    mutate(`/api/pedidos`);
    router.push("/b2b/pedidos-abertos");
    filter?.map((item) => {
      item.quantidade = 0;
    })



  };
  const addItem = async (produto) => {
    let contador = 0;
    if (produtosPedido.length === 0) {
      setProdutosPedido([...produtosPedido, produto])
    } else {
      produtosPedido?.map((item) => {
        if (item._id === produto._id) {
          contador++;
        }
      })
    }
    if (contador > 0) {
      toast.error(`${produto.nome} já existe na lista!`, {
        position: "top-right",
      });
      return;
    } else {
      setProdutosPedido([...produtosPedido, produto])
      toast.success(`${produto.nome} foi adicionado lista!`, {
        position: "top-right",
      });
      attValorPedidoAdicao((parseFloat(produto.valorVenda) * 1));
      return;
    }
  }

  const deleteItem = async (e, id, valorSubtrair) => {
    e.preventDefault();
    setProdutosPedido((produto) =>
      produto.filter((item) => item._id !== id)
    );
    attValorPedidoDelete(valorSubtrair);
  }

  const attPedido = async (value, id) => {
    produtosPedido?.map((item, index) => {

      if (item._id === id) {
        item.quantidade = parseFloat(value);
      }
    })
    attValorPedido();
  }

  const attValorPedido = async (e) => {
    let valorTotal = 0;
    produtosPedido?.map((item, index) => {
      let valorParcial = parseFloat(item.quantidade) * parseFloat(item.valorVenda)

      valorTotal = parseFloat(valorTotal) + parseFloat(valorParcial);
    })
    setValorTotalPedido(valorTotal)
  }

  const attValorPedidoAdicao = async (valorAdcionar) => {
    let valorTotal = 0;
    produtosPedido?.map((item, index) => {
      let valorParcial = parseFloat(item.quantidade) * parseFloat(item.valorVenda)

      valorTotal = parseFloat(valorTotal) + parseFloat(valorParcial);
    })
    setValorTotalPedido(parseFloat(valorTotal) + parseFloat(valorAdcionar))
  }

  const attValorPedidoDelete = async (valorSubtrair) => {
    let valorTotal = 0;
    produtosPedido?.map((item, index) => {
      let valorParcial = parseFloat(item.quantidade) * parseFloat(item.valorVenda)

      valorTotal = parseFloat(valorTotal) + parseFloat(valorParcial);
    })
    setValorTotalPedido(valorTotal - valorSubtrair)
  }

  const attValorTotal = async (e, valorDesconto) => {
    e.preventDefault();
    let valorFinal = parseFloat(valorTotalPedido) - parseFloat(valorDesconto);
    retiraDotComma(valorFinal)
    setValorTotalPedido(valorFinal)
  }

  const attTroco = async (e, valorPago) => {
    e.preventDefault();
    let troco = parseFloat(valorPago) - parseFloat(valorTotalPedido);
    retiraDotComma(troco)
    setTrocoPedido(troco)
  }

  function retiraDotComma(value) {
    let hasComma = new String(value).indexOf(",") !== -1;
    let hasDot = new String(value).indexOf(".") !== -1;

    if (hasComma && hasDot) {
      return parseFloat(new String(value).replace(".", "").replace(",", "."));
    }
    else if (hasComma) {
      return parseFloat(new String(value).replace(",", "."));
    }
    return parseFloat(value)
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
    <>
      <div className="bg-geral">
        <div style={{ display: 'flex' }}>
          <Menu />
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Editar Pedido</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Editar Pedido
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-5">
                    <div className="ec-cat-list card card-default mb-24px">
                      <div className="card-body">
                        <div className="ec-cat-form">
                          <form onSubmit={onSubmit}>
                            <div className="form-group row">

                              <div className="col-md-12 space-t-15 mt-3 date-input">
                                <label htmlFor="phone-2" className="form-label">
                                  Entrada
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={dataPedido}
                                  id="phone-2"
                                  onChange={(e) => setDataPedido(e.target.value, 'entrada')}
                                />
                                <span className="calendar-icon"></span>
                              </div>

                              <label htmlFor="text" className="col-12 col-form-label">
                                Comprador
                              </label>
                              <div className="col-12">
                                <input
                                  id="text"
                                  name="nome"
                                  className="form-control here slug-title"
                                  type="text"
                                  required
                                  value={comandasPedido}
                                  onChange={(e) => setComandasPedido(e.target.value)}
                                />
                              </div>

                              <label htmlFor="text" className="col-12 col-form-label">
                                Documento
                              </label>
                              <div className="col-12">
                                <input
                                  id="text"
                                  name="nome"
                                  className="form-control here slug-title"
                                  type="text"
                                  required
                                  value={cpf}
                                  onChange={(e) => setCpf(e.target.value)}
                                />
                              </div>

                              <label htmlFor="produtos" className="col-12 col-form-label">
                                Produtos
                              </label>
                              <div className="col-12">
                                <ul>
                                  {produtosPedido?.map((item, index) => {
                                    return (
                                      <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                        <button
                                          onClick={(e) => deleteItem(e, item._id, (parseFloat(item.valorVenda) * parseFloat(item.quantidade)))}>
                                          <FaTrash style={{ color: '#DC3545' }} />
                                        </button>
                                        <input
                                          type="number"
                                          name="campoQtd"
                                          className="campoQtd mx-1"
                                          defaultValue={item.quantidade}
                                          onChange={(e) => attPedido(e.target.value, item._id)}
                                        />
                                        <div className="d-flex justify-content-between w-100">
                                          <p>{item.nome}</p>
                                          <p>{formatter.format(parseFloat(item.valorVenda))}</p>
                                        </div>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>

                              <label htmlFor="text" className="col-12 col-form-label">
                                Desconto em Reais
                              </label>
                              <div className="col-12 d-flex align-items-center">
                                <input
                                  id="text"
                                  name="valor"
                                  className="form-control here slug-title"
                                  type="text"
                                  value={`R$ ${descontoPedido}`}
                                  onChange={(e) => { mascaraMoeda(e), setDescontoPedido(e.target.value) }}
                                />
                                <button className="btn btn-info ml-1" type="attValorTotal" onClick={(e) => { attValorTotal(e, descontoPedido) }}>Aplicar</button>
                              </div>

                              <label htmlFor="estoque" className="col-12 col-form-label">
                                Valor Total
                              </label>
                              <div className="col-12">
                                <input
                                  id="estoque"
                                  name="estoque"
                                  className="form-control here slug-title"
                                  type="text"
                                  disabled
                                  value={formatter.format(parseFloat(valorTotalPedido))}
                                  onChange={(e) => setValorTotalPedido(e.target.value)}
                                />
                              </div>

                              <label htmlFor="text" className="col-12 col-form-label">
                                Método de Pagamento
                              </label>
                              <div className="col-12">
                                <select
                                  id="metodoPagamento"
                                  name="metodoPagamento"
                                  className="form-control here slug-title"
                                  defaultValue={metodoPedido}
                                  onChange={(e) => setMetodoPedido(e.target.value)}
                                >
                                  <option value="">{metodoPedido}</option>
                                  <option value="Cartão Crédito">Cartão Crédito</option>
                                  <option value="Cartão Dédito">Cartão Dédito</option>
                                  <option value="Dinheiro">Dinheiro</option>
                                  <option value="Permuta">Permuta</option>
                                  <option value="Pix">Pix</option>
                                </select>
                              </div>
                              {(metodoPedido === "Dinheiro") ?
                                <>
                                  <label htmlFor="text" className="col-12 col-form-label">
                                    Valor Pago
                                  </label>
                                  <div className="col-12 d-flex align-items-center">
                                    <input
                                      id="text"
                                      name="valorPago"
                                      className="form-control here slug-title"
                                      type="text"
                                      value={`R$ ${pagamentoPedido}`}
                                      onChange={(e) => { mascaraMoeda(e), setPagamentoPedido(e.target.value) }}
                                    />
                                    <button className="btn btn-info ml-1" type="attTroco" onClick={(e) => { attTroco(e, parseFloat(pagamentoPedido)) }}>Aplicar</button>
                                  </div>

                                  <label htmlFor="text" className="col-12 col-form-label">
                                    Troco
                                  </label>
                                  <div className="col-12">
                                    <input
                                      id="text"
                                      name="valor"
                                      className="form-control here slug-title"
                                      type="text"
                                      disabled
                                      value={formatter.format(parseFloat(trocoPedido))}
                                    />
                                  </div>
                                </> : <></>
                              }

                            </div>

                            <div className="d-flex mb-3">
                              <div className="row align-items-center">
                                <label className="form-label">Fechar Comanda?</label>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  {active === '0' ?
                                    <input
                                      type="radio"
                                      name="active"
                                      value={'0'}
                                      defaultChecked
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                    :
                                    <input
                                      type="radio"
                                      name="active"
                                      value={'0'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                  }
                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  {active === '1' ?
                                    <input
                                      type="radio"
                                      name="active"
                                      value={'1'}
                                      defaultChecked
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                    :
                                    <input
                                      type="radio"
                                      name="active"
                                      value={'1'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                  }
                                  Não
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12">
                                <button name="submit" type="submit" className="btn btn-warning">
                                  Atualizar compra
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-xl-7">
                    <div className="ec-cat-list card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          <input
                            type="search"
                            placeholder="Digite sua busca"
                            className="form-control here slug-title"
                            onChange={(e) => { setSearchItem(e.target.value.toLowerCase()) }}
                          />
                          <div className="d-flex flex-wrap align-middle justify-content-start" >
                            <div className="col-12 d-flex flex-wrap align-middle justify-content-center py-2"> Clique nos produtos para adicionar ao pedido</div>
                            {filter?.map((item, index) => {
                              return (
                                <div key={index} className="col-3 mouse-hover-pointer p-1" onClick={(e) => { { addItem(item), item.quantidade = 1 } }}>
                                  <div className="teste p-1 d-flex flex-wrap align-middle justify-content-center text-center">
                                    <Image src={item.imagem[0].url} width={100} height={100} alt={item.nome} />
                                    {item.nome}<br />
                                    R${item.valorVenda.toFixed(2)}
                                  </div>
                                </div>
                              )
                            })}
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