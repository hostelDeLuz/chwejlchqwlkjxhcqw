import { useState, useEffect } from "react";
import useSwr, { mutate } from "swr";
import router from 'next/router';
const fetcher = (url) => fetch(url).then((res) => res.json());
import Image from 'next/image'
import Link from 'next/link'
import Calendario from '../../components/b2b_components/Calendario'
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
import formatCpf from '@brazilian-utils/format-cpf';
import { toast } from "react-toastify";
export default function Modal({ customers, id_ }) {
  const [Name, setName] = useState("");

  const [rgfrente, setRgfrente] = useState("");
  const [rgverso, setRgverso] = useState("");
  const [assinatura, setAssinatura] = useState("");

  const [datacadastro, setDatacadastro] = useState("");
  const [passaporte, setPassaporte] = useState("vazio");
  const [datanascimento, setDatanascimento] = useState("")
  const [rg, setRg] = useState("")
  const [telefone, setTelefone] = useState("")
  const [observacoes, setObservações] = useState("")
  const [genero, setGenero] = useState("");
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const [email, setEmail] = useState("");
  const [saude, setSaude] = useState("");
  const [cidadania, setCidadania] = useState("");
  const [aceitotermos, setAceitoTermos] = useState("");
  const [cpf, setCpf] = useState("");
  const [aceitoregras, setAceitoRegras] = useState("");
  const [__id, setId] = useState("");
  const [formulario, setFormulario] = useState("");
  const [qualproblema, setQualproblema] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numerocasa, setNumerocasa] = useState("");
  const [complemento, setComplemento] = useState("");
  const [uf, setUF] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");

  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);

  const handleMostrarMais = () => {
    setMostrarTextoCompleto(!mostrarTextoCompleto);
  }

  useEffect(() => {
    customers?.map((item, index) => {
      if (item._id === id_) {
        setRgfrente(item.rgfrente)
        setRgverso(item.rgverso)
        setAssinatura(item.assinatura)
        setEmail(item.email)
        setSaude(item.saude)
        setCidadania(item.cidadania)
        setAceitoTermos(item.aceitotermos)
        setDatacadastro(item.datacadastro)
        setAceitoRegras(item.aceitoregras)
        setObservações(item.observacoes)
        setTelefone(item.telefone)
        setDatanascimento(item.datanascimento)
        setPassaporte(item.passaporte)
        setCpf(item.cpf)
        setRg(item.rg)
        setName(item.nome)
        setGenero(item.genero)
        setId(item._id)
        setFormulario(item.formulario)
        setEndereco(item.endereco)
        setNumerocasa(item.numerocasa)
        setComplemento(item.complemento)
        setUF(item.uf)
        setCidade(item.cidade)
        setBairro(item.bairro)
        setCep(item.cep)
        setLogradouro(item.logradouro)
        setQualproblema(item.qualproblema)
        
      }
    })
  }, [id_])


  
  const dispararbanco = async (imageArr) => {
    router.reload()
    await axios.put(`/api/hospedes/updateHospedes?id=${__id}`, {
      nome: Name,
      rg: rg,
      cpf: cpf,
      passaporte: passaporte,
      datanascimento: datanascimento,
      telefone: telefone,
      genero: genero,
      email: email,
      saude: saude,
      cidadania: cidadania,
      aceitotermos: aceitotermos,
      rgfrente: rgfrente,
      rgverso: rgverso,
      assinatura: assinatura,
      aceitoregras: aceitoregras,
      observacoes: observacoes,
      formulario: formulario,
      qualproblema: qualproblema,
      cep: cep,
      uf: uf,
      cidade: cidade,
      logradouro: logradouro,
      numerocasa: numerocasa,
      complemento: complemento,
      endereco: endereco,
      bairro: bairro
    });

    mutate('/api/hospedes/getAllHospedes');
  }

  const formatarData = (data) => {
    const partes = data.split('-');
    if (partes.length === 3) {
      const ano = partes[0];
      const mes = partes[1].padStart(2, '0'); // Adiciona zero ao mês se tiver apenas um dígito
      const dia = partes[2].padStart(2, '0'); // Adiciona zero ao dia se tiver apenas um dígito
      return `${ano}-${mes}-${dia}`;
    }
    return data;
  };

  useEffect(() => {
    // Suponha que a data do banco de dados seja obtida de alguma forma
    const dataFormatada = formatarData(datanascimento);
    setDatanascimento(dataFormatada);
  }, [datanascimento]);
  
  const handleDataChange = (e) => {
    const dataFormatada = formatarData(e.target.value);
    setDatanascimento(dataFormatada);
  };
  return (
    <div className="modal fade" id="edit_modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content" style={{ borderRadius: "6px" }}>
          <div className="modal-body">
            <div className="row">
              <div className="ec-vendor-block-img space-bottom-30">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>Iniciar Check-in</h5>
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
                <div className="ec-vendor-upload-detail container">
                  {customers?.map((item, index) => {
                    if (item._id === id_) {
                      return (
                        <form key={index} className="row">
                          <div className="col-md-12 mt-3">
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


                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="email" className="form-label">
                                Telefone
                              </label>
                              <input type="number"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                className="form-control" id="email" />
                            </div>
                          </div>

                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="email" className="form-label">
                                E-mail
                              </label>
                              <input type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control" id="email" />
                            </div>
                          </div>
                          <div className="d-flex mb-3 col-md-4 justify-content-center mt-4">
                            <div className="row align-items-center justify-content-center text-center">
                              <label className="form-label">Cidadania</label>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                {cidadania === 'Brasileira' ?
                                  <input
                                    type="radio"
                                    name="cidadania"
                                    defaultChecked
                                    value={'Brasileira'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setCidadania(e.target.value)}
                                  />
                                  :
                                  <input
                                    type="radio"
                                    name="cidadania"
                                    value={'Brasileira'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setCidadania(e.target.value)}
                                  />
                                }

                                Brasileira
                              </div>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                {cidadania === 'Estrangeira' ?
                                  <input
                                    type="radio"
                                    name="cidadania"
                                    defaultChecked
                                    value={'Estrangeira'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setCidadania(e.target.value)}
                                  />
                                  :
                                  <input
                                    type="radio"
                                    name="cidadania"
                                    value={'Estrangeira'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setCidadania(e.target.value)}
                                  />
                                }

                                Estrangeira
                              </div>
                            </div>
                          </div>
                          <div className="d-flex mb-3 col-md-4 justify-content-center mt-4">
                            <div className="row align-items-center justify-content-center text-center">
                              <label className="form-label">Tem algum problema de saúde?</label>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                {saude === 'Sim' ?
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'Sim'}
                                    defaultChecked
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setSaude(e.target.value)}
                                  />
                                  :
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'Sim'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setSaude(e.target.value)}
                                  />
                                }

                                Sim
                              </div>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                {saude === 'Não' ?
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'Não'}
                                    defaultChecked
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setSaude(e.target.value)}
                                  />
                                  :
                                  <input
                                    type="radio"
                                    name="pagamento"
                                    value={'Não'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setSaude(e.target.value)}
                                  />
                                }

                                Não
                              </div>
                            </div>
                          </div>
                          <div className={`col-md-4 mt-lg-4`}>
                            <div className={`col-md-12 ${saude === 'Não' && 'd-none'}`}>
                              <label htmlFor="email" className="form-label">
                                Qual?
                              </label>
                              <input type="text" value={qualproblema}
                                onChange={(e) => setQualproblema(e.target.value)}
                                className="form-control" id="email" />
                            </div>
                          </div>

                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="endereco" className="form-label">
                                Endereço
                              </label>
                              <input type="text" value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                className="form-control" id="endereco" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="numerocasa" className="form-label">
                                Nº
                              </label>
                              <input type="text" value={numerocasa}
                                onChange={(e) => setNumerocasa(e.target.value)}
                                className="form-control" id="numerocasa" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="complemento" className="form-label">
                                Complemento
                              </label>
                              <input type="text" value={complemento}
                                onChange={(e) => setComplemento(e.target.value)}
                                className="form-control" id="complemento" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="ef" className="form-label">
                                UF
                              </label>
                              <input type="text" value={uf}
                                onChange={(e) => setUF(e.target.value)}
                                className="form-control" id="ef" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="cidade" className="form-label">
                                Cidade
                              </label>
                              <input type="text" value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                className="form-control" id="cidade" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="bairro" className="form-label">
                                Bairro
                              </label>
                              <input type="text" value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                className="form-control" id="bairro" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="cep" className="form-label">
                                CEP
                              </label>
                              <input type="text" value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                className="form-control" id="cep" />
                            </div>
                          </div>
                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="logradouro" className="form-label">
                                Logradouro
                              </label>
                              <input type="text" value={logradouro}
                                onChange={(e) => setLogradouro(e.target.value)}
                                className="form-control" id="logradouro" />
                            </div>
                          </div>


                          {cidadania === 'Brasileira' &&
                            <>
                              <div className="col-md-12 mt-3">
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

                              <div className="col-md-12 mt-3">
                                <label htmlFor="phone-1" className="form-label">
                                  CPF
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="phone-1"
                                  value={formatCpf(cpf)}
                                  onChange={(e) => setCpf(e.target.value)}
                                />
                              </div>
                            </>
                          }

                          {cidadania === 'Estrangeira' &&
                            <div className="col-md-12 mt-3">
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
                          }
                          <div className="col-md-12 mt-3 date-input">
                            <label htmlFor="phone-2" className="form-label">
                              Nascimento
                            </label>
                            <input
                              type="date"
                              value={datanascimento}
                              className="form-control slug-title"
                              id="phone-2"
                              onChange={(e) => setDatanascimento(e.target.value)}
                            />
                            <span class="calendar-icon"></span>
                          </div>

                          <div className="col-md-12 mt-3">
                            <label className="form-label">Genero</label>
                            <select className="form-control" onChange={(e) => setGenero(e.target.value)}>
                              <option value={genero} selected>{genero}</option>
                              <option value={'masculino'} >Masculino</option>
                              <option value={'feminino'}>Feminino</option>
                              <option value={'outros'}>Outros</option>

                            </select>
                          </div>
                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              RG Frente
                            </label>
                            {rgfrente && (
                              <img src={rgfrente.url} alt="RG Frente" />
                            )}

                          </div>
                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              RG Verso
                            </label>
                            {rgverso && (
                              <img src={rgverso.url} alt="RG Verso" />
                            )}
                          </div>
                          <div className="col-12 d-flex justify-content-center">
                            <div className="col-md-4 mt-3">
                              <label htmlFor="phone-1" className="form-label text-center w-100">
                                Assinatura
                              </label>
                              {assinatura && (
                                <img src={assinatura.url} alt="RG Verso" />
                              )}
                            </div>
                          </div>
                          <div className="col-md-12 mt-3">
                            <label className="form-label">Observações</label>
                            <textarea
                              rows={5}
                              className="slug-title"
                              id="inputEmail4"
                              value={observacoes}
                              onChange={(e) => setObservações(e.target.value)}
                            />
                          </div>

                          <div className="p-4 mt-3" style={{ borderRadius: '5px', background: 'whitesmoke', boxShadow: '0 0 3px black' }}>
                            <div>

                            </div>
                            <h4 className="text-center mb-2">TERMO DE CESSÃO DE DIREITO DE USO DE IMAGEM E VOZ</h4>
                            <p style={{ textAlign: 'justify' }}>AUTORIZO o uso de minha imagem em fotos ou vídeos, para serem utilizados em divulgações para Juliana Azevedo Jacques, CNPJ 21.084.315/0001-34, nome fantasia HOSTEL DE LUZ. A presente autorização é concedida a título gratuito, abrangendo o uso da imagem acima mencionada em todo território nacional e no exterior, em todas as suas modalidades e, em destaque, das seguintes formas: (I) redes sociais; (II) home page; (III) divulgação em geral, online e impressa. Por esta ser a expressão da minha vontade, declaro que autorizo o uso acima descrito sem que nada haja a ser reclamado a título de direitos conexos à minha imagem ou a qualquer outro</p>
                            <div className="d-flex mb-3 col-md-12 justify-content-center mt-4">
                              <div className="row align-items-center justify-content-center text-center">
                                <label className="form-label">Aceito os termos</label>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  {aceitotermos === 'Sim' ?
                                    <input
                                      type="radio"
                                      name="termo"
                                      defaultChecked
                                      value={'Sim'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setAceitoTermos(e.target.value)}
                                    />
                                    :
                                    <input
                                      type="radio"
                                      name="termo"
                                      value={'Sim'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setAceitoTermos(e.target.value)}
                                    />
                                  }

                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  {aceitotermos === 'Não' ?
                                    <input
                                      type="radio"
                                      name="termo"
                                      defaultChecked
                                      value={'Não'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setAceitoTermos(e.target.value)}
                                    />
                                    :
                                    <input
                                      type="radio"
                                      name="termo"
                                      value={'Não'}
                                      style={{ width: '20px', margin: '0 15px 0 0' }}
                                      onChange={(e) => setAceitoTermos(e.target.value)}
                                    />
                                  }

                                  Não
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 mt-3" style={{ borderRadius: '5px', background: 'whitesmoke', boxShadow: '0 0 3px black' }}>
                            <div></div>
                            <h4 className="text-center mb-2">Termo de Compromisso - REGRAS</h4>
                            <p className="mt-3" style={{ textAlign: 'center', maxHeight: mostrarTextoCompleto ? 'none' : '200px', overflow: 'hidden', transition: 'ma/xeight 0.3s ease-in-out' }}>
                              <p className='mb-3' style={{ fontWeight: '600' }}>Bem-vindo ao Hostel de luz!</p>
                              <p className='mb-2'>Antes de aproveitar sua estadia, precisamos que você assine um termo de compromisso, prometendo seguir algumas regras básicas para mantermos a vibe sempre boa:
                              </p>
                              <p className='mb-2'>As diárias devem ser pagas até o momento do seu check-in.
                              </p>
                              <p className='mb-2'>Guarde seus pertences com carinho e atenção.
                              </p>
                              <p className='mb-2'>Nós não nos responsabilizamos por quaisquer objetos alegados serem perdidos dentro da propriedade. Mas se nós acharmos, vamos guardar com todo carinho e tentar devolver.
                              </p>
                              <p className='mb-2'>Para segurança de todos, temos câmeras  nas áreas comuns, e por questões de privacidade, não podemos ter nos quartos e banheiros.
                              </p>
                              <p className='mb-2'>Temos uma cozinha equipada para melhor conforto dos hóspedes. Não deixe qualquer louça suja, nem comida nas panelas.
                              </p>
                              <p className='mb-2'>Temos etiquetas e caneta na bancada. Identifique seus itens com nome e data de checkout para que a gente possa se organizar melhor.
                              </p>
                              <p className='mb-2'>Toda quinta-feira fazemos uma limpeza e os itens sem identificação serão descartados, ok?
                              </p>
                              <p className='mb-2'>Mantenha as áreas comuns limpas, especialmente o banheiro e cozinha.
                              </p>
                              <p className='mb-2'>É estritamente proibido o uso de drogas ilícitas dentro do hostel. Assim como transitar sem camiseta ou em trajes menores.
                              </p>
                              <p className='mb-2'>Caso você danifique qualquer objeto, será responsável pelos custos referentes ao conserto.
                              </p>
                              <p className='mb-2'>Para permanência de não hóspedes, há uma taxa de R$10. Sendo proibida a entrada no quarto e o horário de saída é até 23h00.
                              </p>
                              <p className='mb-2'>Não troque de cama e não pegue travesseiros ou lençóis/cobertores de outras camas.
                              </p>
                              <p className='mb-2'>O check-out tem que ser feito até as 11h! Por favor, respeite pois precisamos fazer higienização do quarto e das camas para os próximos hóspedes.
                              </p>
                              <p className='mb-2'>Caso precise de um horário diferente de check-out, deixar suas malas e buscar depois ou voltar depois para tomar aquele banho, consulte na recepção qual a taxa.
                              </p>
                              <p className='mb-2'>Se precisar de algo, não hesite em nos consultar! Faremos de tudo que estiver ao nosso alcance para poder ajudar!
                              </p></p>
                            <div className="btn btn-primary mt-3" onClick={handleMostrarMais}>
                              {mostrarTextoCompleto ? 'Mostrar Menos' : 'Mostrar Mais'}
                            </div>
                          </div>
                          <div className="col-md-12 mt-3 d-flex align-items-center justify-content-center">
                            {aceitoregras === 'Aceito' ?
                              <input
                                type="checkbox"
                                id="phone-1"
                                defaultChecked
                                value={'Aceito'}
                                style={{ width: '80px', height: '25px' }}
                                onChange={(e) => setAceitoRegras(e.target.value)}
                              />
                              :
                              <input
                                type="checkbox"
                                id="phone-1"
                                value={'Aceito'}
                                style={{ width: '80px', height: '25px' }}
                                onChange={(e) => setAceitoRegras(e.target.value)}
                              />
                            }

                            <label htmlFor="phone-1" className="form-label m-0" style={{ fontWeight: '600' }}>
                              Li e aceito as regras do estabelecimento
                            </label>
                          </div>
                          <div className="col-md-6 space-t-15 mt-4 d-flex justify-content-center text-center">
                            <div
                              onClick={(e) => dispararbanco()}
                              className="btn btn-sm btn-primary"
                              style={{ width: '250px' }}
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              Atualizar Hospede
                            </div>
                          </div>
                          <div className="col-md-6 space-t-15 mt-4 d-flex justify-content-center text-center">
                            <div
                              className="btn btn-sm btn-primary"
                              style={{ width: '250px' }}

                            >
                              <div data-bs-dismiss="modal"
                                aria-label="Close">
                                <Link
                                  href={`/b2b/checkInhospede?id=${id_}`}
                                  style={{ width: '250px', background: '#30AF3B' }}
                                  className="btn btn-sm btn-primary"
                                > Iniciar Check-in</Link>
                              </div>

                            </div>
                          </div>

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
