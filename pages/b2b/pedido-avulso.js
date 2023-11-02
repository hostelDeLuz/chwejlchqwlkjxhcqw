import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import useSwr, { mutate } from "swr";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai"
import { useCookies, expires } from 'react-cookie';
import router from 'next/router'
import Menu from "../../components/b2b_components/Menu";
const fetcher = (url) => fetch(url).then((res) => res.json());

//ADD NO CSS

// [type="number"] {
//   width: 60px;
// padding: 0 8px !important;
// }

// .campoQtd{
//   width: 60px;
//   height: 35px;
//   line-height: 33px;
// }

export default function NovoPedido({ }) {
  const [dataPedido, setDataPedido] = useState("");
  const [comandasPedido, setComandasPedido] = useState("");
  const [produtosPedido, setProdutosPedido] = useState([]);
  const [valorTotalPedido, setValorTotalPedido] = useState(0);
  const [descontoPedido, setDescontoPedido] = useState("");
  const [metodoPedido, setMetodoPedido] = useState("");
  const [pagamentoPedido, setPagamentoPedido] = useState("");
  const [trocoPedido, setTrocoPedido] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [filter, setFilter] = useState([]);
  const [hostel, setHostel] = useState('');
  const [nomeprod, setNomeprod] = useState('');
  const [valorprod, setValorprod] = useState('');
  const [valorvenda, setValorvenda] = useState('');
  const [quantidadevenda, setQuantidadevenda] = useState('');
  const [cpf, setCpf] = useState('');
  const [active, setActive] = useState('1');
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const { data: produtos } = useSwr(`/api/produtos/getAllProdutos`, fetcher);
  const [userhostel, setUserhostel] = useState('');
  useEffect(() => {
    setUserhostel(cookies.user_hostel)
  }, [cookies])
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
    setDataPedido(dataDia)
    setFilter(produtos)
  }, [produtos])

  useEffect(() => {
    let itemObtido;
    setFilter(produtos?.filter(item => {
      return itemObtido = item.nome.toLowerCase().includes(searchItem);
    }));
  }, [searchItem]);

  const onSubmit = async (e) => {
    e.preventDefault();

    router.push("/b2b/pedidos-abertos");

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
    let data = await axios.post(`/api/pedidos/insertPedido`, {
      data_pedido: dataPedido,
      comandas: comandasPedido,
      cpf: cpf,
      hostel: userhostel,
      dataentrada: new Date(),
      datafechamento: datadefechamento,
      ativo: active,
      produtos: [
        {
          estoque: 0,
          nome: nomeprod,
          valorCompra: parseFloat(valorprod),
          valorVenda: parseFloat(valorvenda),
          quantidade: quantidadevenda,
          _id: new Date
        }
      ],
      desconto: descontoPedido,
      valor_total: parseFloat(valorvenda),
      metodo_pagamento: metodoPedido,
      acesso_comanda: cookies.user_login,
    });

    mutate(`/api/pedidos`);

    filter?.map((item) => {
      item.quantidade = 0;
    })

    toast('Pedido adiconado com sucesso!', {
      position: "top-right",
    });


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
      attValorPedidoAdicao((parseFloat(produto.valorVenda) * parseFloat(produto.quantidade)));
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
        item.quantidade = parseInt(value);
      }
    })
    attValorPedido();
  }

  const attValorPedido = async (e) => {
    let valorTotal = 0;
    produtosPedido?.map((item, index) => {
      let valorParcial = item.quantidade * item.valorVenda

      valorTotal = parseFloat(valorTotal) + parseFloat(valorParcial);
    })
    setValorTotalPedido(valorTotal)
  }

  const attValorPedidoAdicao = async (valorAdcionar) => {
    let valorTotal = 0;
    produtosPedido?.map((item, index) => {
      let valorParcial = item.quantidade * item.valorVenda

      valorTotal = parseFloat(valorTotal) + parseFloat(valorParcial);
    })
    setValorTotalPedido(valorTotal + valorAdcionar)
  }

  const attValorPedidoDelete = async (valorSubtrair) => {
    let valorTotal = 0;
    produtosPedido?.map((item, index) => {
      let valorParcial = item.quantidade * item.valorVenda

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

  String.prototype.reverse = function() {
    return this.split('').reverse().join('');
  };
  
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
          <Menu parametro={'22'} />
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>Venda Avulsa</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Venda Avulsa
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="ec-cat-list card card-default mb-24px">
                      <div className="card-body">

                        <div className="card-body">
                          <div className="ec-cat-form">
                            <form onSubmit={onSubmit}>
                              <div className="form-group row">

                                <div className="d-flex flex-wrap">
                                  <div className="col-lg-3 col-12 p-1">
                                    <label htmlFor="text" className="col-12 col-form-label">
                                      Nome
                                    </label>
                                    <div className="col-12">
                                      <input
                                        id="text"
                                        name="nome"
                                        className="form-control here slug-title"
                                        type="text"
                                        required
                                        value={nomeprod}
                                        onChange={(e) => setNomeprod(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-12 p-1">
                                    <label htmlFor="text" className="col-12 col-form-label">
                                      Valor da Compra
                                    </label>
                                    <div className="col-12">
                                      <input
                                        id="text"
                                        name="nome"
                                        className="form-control here slug-title"
                                        type="text"
                                        required
                                        value={`R$ ${valorprod}`}
                                        onChange={(e) => {mascaraMoeda(e); setValorprod(e.target.value);}}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-12 p-1">
                                    <label htmlFor="text" className="col-12 col-form-label">
                                      Valor da venda
                                    </label>
                                    <div className="col-12">
                                      <input
                                        id="text"
                                        name="nome"
                                        className="form-control here slug-title"
                                        type="text"
                                        required
                                        value={`R$ ${valorvenda}`}
                                        onChange={(e) => {mascaraMoeda(e); setValorvenda(e.target.value)}}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-3 col-12 p-1">
                                    <label htmlFor="text" className="col-12 col-form-label">
                                      Quantidade
                                    </label>
                                    <div className="col-12">
                                      <input
                                        id="text"
                                        name="nome"
                                        className="form-control here slug-title"
                                        type="number"
                                        required
                                        value={quantidadevenda}
                                        onChange={(e) => setQuantidadevenda(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <label htmlFor="text" className="col-12 col-form-label">
                                  Data
                                </label>
                                <div className="col-12">
                                  <input
                                    id="data"
                                    name="data"
                                    className="form-control here slug-title"
                                    type="date"
                                    defaultValue={dataDia}
                                    onChange={(e) => setDataPedido(e.target.value)}
                                  />
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
                                    <option value="">Escolha uma opção de pagamento</option>
                                    <option value="Cartão Crédito">Cartão Crédito</option>
                                    <option value="Cartão Dédito">Cartão Dédito</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Permuta">Permuta</option>
                                    <option value="Pix">Pix</option>
                                  </select>
                                </div>


                              </div>


                              <div className="d-flex mb-3 space-t-15">
                                <div className="row align-items-center">
                                  <label className="form-label">Fechar Comanda?</label>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    <input
                                      type="radio"
                                      name="active"
                                      value={'0'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                    Sim
                                  </div>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    <input
                                      type="radio"
                                      name="active"
                                      value={'1'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setActive(e.target.value)}
                                    />
                                    Não
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-12">
                                  <button name="submit" type="submit" className="btn btn-warning">
                                    Concluir compra
                                  </button>
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