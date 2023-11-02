import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import router from "next/router";
import { toast } from "react-toastify";
import Image from 'next/image';
import sgMail from "@sendgrid/mail"

import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ModalOrder({ orders, id_ }) {

  const [] = useState();
  const { data: customers } = useSwr(`/api/customers/getAllCustomers`, fetcher);

  const [valueStatus, setValueStatus] = useState("")
  const [valueId, setValueId] = useState("")
  const [date, setDate] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")


  useEffect(() => {
    console.log(orders, id_)
    orders?.forEach(item => {
      if (item._id === id_) {
        setDate(item.date);
        setValueId(item._id);
        setValueStatus(item.status);
        customers?.forEach(item2 => {
          if(parseInt(item.id_user) === item2._id){
            setEmail(item2.email);
            setName(item2.name);
            setInputs({
              senderEmail: 'suporte2@frequencia.com.br',
              subtitleEmail: 'Atualização do Pedido - Loja As Papoulas',
              saleId: `${item._id}`,
              name: `${item2.name}`,
              email: `${item2.email}`,
              valueStatus: `${item.status}`,
            })
          }
      })
        }
    });

  }, [id_])

  async function updatePendingOrder(e) {
    e.preventDefault()

    await axios
      .put(`/api/pendingOrder/updatePendingOrder?id=${id_}`, {
        status: valueStatus,
      })
      .then(() => {
        toast.success("Status editado com sucesso");

        mutate("/api/pendingOrder")
        mutate("/api/orderHistory")
      
        handleOnSubmit(e);
      })
      .catch(() => toast.error("OPS! Algo deu errado!"));
  }
  
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  const [inputs, setInputs] = useState({
    email: '',
    senderEmail: '',
    subtitleEmail: '',
    saleId: '',
    name: '',
    valueStatus: ''
  })

  const handleResponse = (status, msg) => {
    if (status === 200) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg }
      })
      setInputs({
        senderEmail: '',
        subtitleEmail: '',
        saleId: '',
        name: '',
        email: '',
        valueStatus: ''
      })
    } else {
      setStatus({
        info: { error: true, msg: msg }
      })
    }
  }

  const handleOnSubmit = async e => {
    e.preventDefault()
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }))
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inputs)
    })
    const text = await res.text()
    handleResponse(res.status, text)
  }

  const customImgLoader = ({ src }) => {
    return `${src}`;
  };

  
  return (
    <div className="modal fade" id="edit_modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderRadius: "6px" }}>
          <div className="modal-body">
            <div className="row">
              <div className="ec-vendor-block-img space-bottom-30">
                <div className="ec-vendor-upload-detail">
                  {orders?.map((item, index) => {
                    let addressArr = JSON.parse(item.address);
                    let productsArr = JSON.parse(item.products);
                    const date = new Date(item.date);
                    if (item._id === id_) {
                      return (
                        <>
                          <form className="row g-3" key={item.id}>
                            {customers?.map((item2, index) => {
                              
                              if (item.id_user === item2._id) {
                                return (
                                  <>
                                    <label className="form-label">
                                      <td>Data do pedido:{item.date}</td>
                                    </label>
                                    <div className="col-md-6 space-t-15 mt-3">
                                      <label className="form-label">
                                        Nome
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={item2.name}
                                        disabled
                                      />
                                    </div>

                                    <div className="col-md-6 space-t-15 mt-3">
                                      <label className="form-label">
                                        E-mail
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={item2.email}
                                        disabled
                                      />
                                    </div>

                                    <div className="col-md-6 space-t-15 d-flex justify-content-between mt-3">
                                      <div className="col-md-12">
                                        <label className="form-label">
                                          Telefone
                                        </label>
                                        <input type="text" value={item2.phone} className="form-control" disabled />
                                      </div>
                                    </div>

                                    <div className="col-md-6 space-t-15 mt-3">
                                      <label className="form-label">
                                        CPF / CNPJ
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={item2.cpf_cnpj}
                                        disabled
                                      />
                                    </div>
                                  </>
                                )
                              }
                            })}

                            <div className="col-md-12 space-t-15 d-flex justify-content-between mt-3">
                              <div className="col-2">
                                <label className="form-label">
                                  Endereço
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.endereco}
                                  disabled
                                />
                              </div>
                              <div className="col-1">
                                <label className="form-label">
                                  Nº
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.numero}
                                  disabled
                                />
                              </div>
                              <div className="col-2">
                                <label className="form-label">
                                  Bairro
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.bairro}
                                  disabled
                                />
                              </div>
                              <div className="col-1">
                                <label className="form-label">
                                  Complemento
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.complemento}
                                  disabled
                                />
                              </div>
                              <div className="col-2">
                                <label className="form-label">
                                  CEP
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.cep}
                                  disabled
                                />
                              </div>
                              <div className="col-2">
                                <label className="form-label">
                                  Cidade
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.cidade}
                                  disabled
                                />
                              </div>
                              <div className="col-1">
                                <label className="form-label">
                                  Estado
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={addressArr.estado}
                                  disabled
                                />
                              </div>
                            </div>

                            <div className="col-12 mt-3">
                              <table
                                id="responsive-data-table"
                                className="table table-striped"
                                style={{ width: "100%" }}
                              >
                                  <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Embalagem</th>
                                    <th>Preço</th>
                                    <th>Quantidade</th>
                                    <th>Total</th>
                                    <th>Produto</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {
                                    productsArr.produtos?.map((item4, index) => {
                                      return (
                                        <>
                                          <tr key={item4.id} className="align-middle">
                                            <td>{item4.id}</td>
                                            <td>{item4.titulo}</td>
                                            <td>{item4.embalagem}</td>
                                            <td><p>R${item4.valor.toFixed(2)} </p></td>
                                            <td><p>{item4.quantidadeCompra}</p></td>
                                            <td><p>R${item4.total.toFixed(2)}</p></td>
                                            <td>
                                              <Image
                                                loader={customImgLoader}
                                                className="tbl-thumb"
                                                src={item4.imagem || require("../../assets/images/noimg.jpg")}
                                                alt="Product Image"
                                                width={500}
                                                height={500}
                                              />
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>

                            <div className="col-6 mt-3">
                              <label className="form-label">
                                Status do Pedido
                              </label>
                              <select
                                className="form-control form-control-select"
                                onChange={(e) => setValueStatus(e.target.value)}
                              >
                                <option value={item.status}>{item.status}</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Aprovado">Aprovado</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Finalizado">Finalizado</option>
                                {/* <option value="Cancelado">Cancelado</option> */}
                              </select>
                            </div>

                            <div className="col-md-12 space-t-15 mt-4 text-center d-flex justify-content-around">
                              <button
                                onClick={(e) => updatePendingOrder(e)}
                                className="btn btn-sm btn-secondary qty_close"
                                style={{ width: '250px' }}
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                Atualizar
                              </button>
                              <button
                                onClick={(e) => e.preventDefault()}
                                className="btn btn-sm btn-primary qty_close"
                                style={{ width: '250px' }}
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                Fechar
                              </button>
                            </div>
                          </form>
                        </>
                      )
                    }
                  }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
