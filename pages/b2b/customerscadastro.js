import axios from "axios";
import Image from 'next/image';
import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "../../components/b2b_components/Modal";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
import router from 'next/router'
import { toast } from "react-toastify";
const fetcher = (url) => fetch(url).then((res) => res.json());
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
import formatCpf from '@brazilian-utils/format-cpf';
export default function Hospedecadastro() {
  const { data: hospedes } = useSwr(`/api/hospedes/getAllHospedes`, fetcher);
  const [Name, setName] = useState("");
  const [rgFrenteImage, setRgFrenteImage] = useState(null);
  const [rgVersoImage, setRgVersoImage] = useState(null);
  const [passaporte, setPassaporte] = useState("vazio");
  const [datanascimento, setDatanascimento] = useState("")
  const [rg, setRg] = useState("")
  const [telefone, setTelefone] = useState("")
  const [observacoes, setObservações] = useState("")
  const [genero, setGenero] = useState("");
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const [email, setEmail] = useState("");
  const [saude, setSaude] = useState("Não");
  const [cidadania, setCidadania] = useState("");
  const [aceitotermos, setAceitoTermos] = useState("");
  const [cpf, setCpf] = useState("");
  const [aceitoregras, setAceitoRegras] = useState("");
  const [qualproblema, setQualproblema] = useState("");
  const [parametro, setParametro] = useState('Painel');
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);

  const handleMostrarMais = () => {
    setMostrarTextoCompleto(!mostrarTextoCompleto);
  }

  const atthospoede = () => {
    let contador = 0;
    let errorOccurred = false;
    if(Name === '' || telefone === '' || datanascimento === '' || saude === '' || cidadania === '' || rgFrenteImage === null || rgVersoImage === null || aceitotermos === '' || aceitoregras === ''){
      toast.error('Gentileza preencha todos os campos, coloque pelo menos um documento.')
    }else{
      if (hospedes.length === 0) {
        if (!errorOccurred) {
          errorOccurred = true;
          toast.success('Úsuario cadastrado!')
          onSubmit()
          router.push("/b2b/hospedesall");
        }
      } else {
        hospedes?.map((item, index) => {
          if (Name === '' || cpf === '' || telefone === '') {
            contador = contador + 1
            if (!errorOccurred) {
              errorOccurred = true;
              toast.error('gentileza preencha os campos!')
            }
          } else if (item.rg === rg || item.cpf === cpf || item.passaporte === passaporte) {
            contador = contador + 1
            if (!errorOccurred) {
              errorOccurred = true;
              toast.error('Úsuario ja cadastrado')
            }
          } else if (contador === 0 && errorOccurred === false) {
            if (!errorOccurred) {
              errorOccurred = true;
              toast.success('Úsuario cadastrado!')
              onSubmit()
            }
          }
        })
      }
    }
  };

  const onSubmit = async () => {
    let contador = 0;
    let contadorToast = 0;
    let imageArr = [];
    [...Array(2)]?.map((item, index) => {
      const name = `fotodocumento${cpf}${index}`
      const storageRef = ref(storage, `image/${name}`)
      let uploadTask
      if(index === 0){
        uploadTask = uploadBytesResumable(storageRef, rgFrenteImage)
      }else{
        uploadTask = uploadBytesResumable(storageRef, rgVersoImage)
      }
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  
          setProgressUpload(progress) // to show progress upload
        },
        (error) => {
          toast.error(error.message)
        },
  
        async () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //url is download url of file
            setDownloadURL((current) => [
              ...current,
              {
                url: url,
                path: name,
              },
            ]);
            const obj = [{ url: url, path: name }];
            imageArr = [...imageArr, ...obj];
            contador++;
  
            if (2 === contador) {
              setTimeout(() => {
                contador = 0;
                dispararbanco(imageArr)
              }, 2000)
            }
          })
        },
      )
    })
    

  };

  const dispararbanco = async (imageArr) => {

    await axios.put(`/api/hospedes/insertHospedes`, {
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
      rgfrente: imageArr[0],
      rgverso: imageArr[1],
      aceitoregras: aceitoregras,
      observacoes: observacoes,
      formulario: parametro,
      qualproblema: qualproblema,
    });

    router.push("/b2b/hospedesall");
    mutate('/api/hospedes/getAllHospedes');
  }
  
  return (
    <div style={{ backgroundColor: '#f3f3f3' }}>
      <div style={{ display: 'flex' }}>
        <Menu  parametro={'4'}/>
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <h1>Novo Hospedes</h1>
                <p className="breadcrumbs">
                  <span>
                    <Link href="/b2b">Dashboard</Link>
                  </span>
                  <span>
                    <i className="mdi mdi-chevron-right"></i>
                  </span>
                  Hospedes
                </p>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="card card-default">
                    <div className="card-body">
                      <div>
                      <form className="row">
                          <div className="col-md-12 mt-3">
                            <label htmlFor="first-name" className="form-label">
                              Nome
                            </label>
                            <input
                              type="text"
                              className="form-control"
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
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control" id="email" />
                            </div>
                          </div>

                          <div className="d-flex mb-3 col-md-4 justify-content-center mt-4">
                            <div className="row align-items-center justify-content-center text-center">
                              <label className="form-label">Tem algum problema de saúde?</label>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                <input
                                  type="radio"
                                  name="pagamento"
                                  value={'Sim'}
                                  style={{ width: '20px', margin: '0 15px 0 0' }}
                                  onChange={(e) => setSaude(e.target.value)}
                                />
                                Sim
                              </div>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                <input
                                  type="radio"
                                  name="pagamento"
                                  value={'Não'}
                                  style={{ width: '20px', margin: '0 15px 0 0' }}
                                  onChange={(e) => setSaude(e.target.value)}
                                />
                                Não
                              </div>
                            </div>
                          </div>
                          <div className={`col-md-4 mt-lg-4`}>
                            <div className={`col-md-12 ${saude === 'Não' && 'd-none'}`}>
                              <label htmlFor="email" className="form-label">
                                Qual?
                              </label>
                              <input type="text"
                                onChange={(e) => setQualproblema(e.target.value)}
                                className="form-control" id="email" />
                            </div>
                          </div>
                          <div className="d-flex mb-3 col-md-4 justify-content-center mt-4">
                            <div className="row align-items-center justify-content-center text-center">
                              <label className="form-label">Cidadania</label>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                <input
                                  type="radio"
                                  name="cidadania"
                                  value={'Brasileira'}
                                  style={{ width: '20px', margin: '0 15px 0 0' }}
                                  onChange={(e) => setCidadania(e.target.value)}
                                />
                                Brasileira
                              </div>
                              <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                <input
                                  type="radio"
                                  name="cidadania"
                                  value={'Estrangeira'}
                                  style={{ width: '20px', margin: '0 15px 0 0' }}
                                  onChange={(e) => setCidadania(e.target.value)}
                                />
                                Estrangeira
                              </div>
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
                              className="form-control slug-title"
                              id="phone-2"
                              onChange={(e) => setDatanascimento(e.target.value)}
                            />
                            <span className="calendar-icon"></span>
                          </div>

                          <div className="col-md-12 mt-3">
                            <label className="form-label">Genero</label>
                            <select className="form-control" onChange={(e) => setGenero(e.target.value)}>
                              <option value={''} selected></option>
                              <option value={'masculino'} >Masculino</option>
                              <option value={'feminino'}>Feminino</option>
                              <option value={'outros'}>Outros</option>

                            </select>
                          </div>
                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              Foto Frente
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="phone-1"
                              style={{ border: 'none', minHeight: '30px' }}
                              onChange={(e) => setRgFrenteImage(e.target.files[0])}
                            />
                            {rgFrenteImage && (
                              <img src={URL.createObjectURL(rgFrenteImage)} alt="Foto Frente" />
                            )}
                          </div>
                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              Foto Verso
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="phone-1"
                              style={{ border: 'none', minHeight: '30px' }}
                              onChange={(e) => setRgVersoImage(e.target.files[0])}
                            />
                            {rgVersoImage && (
                              <img src={URL.createObjectURL(rgVersoImage)} alt="Foto Verso" />
                            )}
                          </div>
                          <div className="col-md-12 mt-3">
                            <label className="form-label">Observações</label>
                            <textarea
                              rows={5}
                              className="slug-title"
                              id="inputEmail4"
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
                                  <input
                                    type="radio"
                                    name="termo"
                                    value={'Sim'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setAceitoTermos(e.target.value)}
                                  />
                                  Sim
                                </div>
                                <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                  <input
                                    type="radio"
                                    name="termo"
                                    value={'Não'}
                                    style={{ width: '20px', margin: '0 15px 0 0' }}
                                    onChange={(e) => setAceitoTermos(e.target.value)}
                                  />
                                  Não
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 mt-3" style={{ borderRadius: '5px', background: 'whitesmoke', boxShadow: '0 0 3px black' }}>
                            <div></div>
                            <h4 className="text-center mb-2">Termo de Compromisso - REGRAS</h4>
                            <div className="mt-3" style={{ maxHeight: mostrarTextoCompleto ? 'none' : '200px', overflow: 'hidden', transition: 'ma/xeight 0.3s ease-in-out' }}>
                              <ul>
                                <li className='mb-3 text-center' style={{ fontWeight: '600' }}>Bem-vindo ao Hostel de luz!</li>
                                <li className='mb-2 text-center'>Antes de aproveitar sua estadia, precisamos que você assine um termo de compromisso, prometendo seguir algumas regras básicas para mantermos a vibe sempre boa:
                                </li><br />
                                <li className='mb-2'>• As diárias devem ser pagas até o momento do seu check-in.
                                </li>
                                <li className='mb-2'>• Guarde seus pertences com carinho e atenção.
                                </li>
                                <li className='mb-2'>• Nós não nos responsabilizamos por quaisquer objetos alegados serem perdidos dentro da propriedade. Mas se nós acharmos, vamos guardar com todo carinho e tentar devolver.
                                </li>
                                <li className='mb-2'>• Para segurança de todos, temos câmeras  nas áreas comuns, e por questões de privacidade, não podemos ter nos quartos e banheiros.
                                </li>
                                <li className='mb-2'>• Temos uma cozinha equipada para melhor conforto dos hóspedes. Não deixe qualquer louça suja, nem comida nas panelas.
                                </li>
                                <li className='mb-2'>• Temos etiquetas e caneta na bancada. Identifique seus itens com nome e data de checkout para que a gente possa se organizar melhor.
                                </li>
                                <li className='mb-2'>• Toda quinta-feira fazemos uma limpeza e os itens sem identificação serão descartados, ok?
                                </li>
                                <li className='mb-2'>• Mantenha as áreas comuns limpas, especialmente o banheiro e cozinha.
                                </li>
                                <li className='mb-2'>• É estritamente proibido o uso de drogas ilícitas dentro do hostel. Assim como transitar sem camiseta ou em trajes menores.
                                </li>
                                <li className='mb-2'>• Caso você danifique qualquer objeto, será responsável pelos custos referentes ao conserto.
                                </li>
                                <li className='mb-2'>• Para permanência de não hóspedes, há uma taxa de R$10. Sendo proibida a entrada no quarto e o horário de saída é até 23h00.
                                </li>
                                <li className='mb-2'>• Não troque de cama e não pegue travesseiros ou lençóis/cobertores de outras camas.
                                </li>
                                <li className='mb-2'>• O check-out tem que ser feito até as 11h! Por favor, respeite pois precisamos fazer higienização do quarto e das camas para os próximos hóspedes.
                                </li>
                                <li className='mb-2'>• Caso precise de um horário diferente de check-out, deixar suas malas e buscar depois ou voltar depois para tomar aquele banho, consulte na recepção qual a taxa.
                                </li>
                                <li className='mb-2'>• Se precisar de algo, não hesite em nos consultar! Faremos de tudo que estiver ao nosso alcance para poder ajudar!
                                </li>
                              </ul>
                            </div>
                            <div className="btn btn-primary mt-3" onClick={handleMostrarMais}>
                              {mostrarTextoCompleto ? 'Mostrar Menos' : 'Mostrar Mais'}
                            </div>
                          </div>
                          <div className="col-md-12 mt-3 d-flex align-items-center justify-content-center">
                            <input
                              type="checkbox"
                              id="phone-1"
                              value={'Aceito'}
                              style={{ width: '80px', height: '25px' }}
                              onChange={(e) => setAceitoRegras(e.target.value)}
                            />
                            <label htmlFor="phone-1" className="form-label m-0" style={{ fontWeight: '600' }}>
                              Li e aceito as regras do estabelecimento
                            </label>
                          </div>
                          <div className="col-md-12 mt-4 d-flex justify-content-center text-center">
                            <div
                              onClick={(e) => atthospoede(e)}
                              className="btn btn-sm btn-primary qty_close"
                              style={{ width: '250px' }}
                            >
                              Enviar Cadastro!
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