'use client'
import axios from "axios";
import Image from 'next/image';
import { useEffect, useState, useRef } from "react";
import { BsEraser } from 'react-icons/bs';
import Link from "next/link";
import useSwr, { mutate } from "swr";
import InputMask from 'react-input-mask';
import router from 'next/router'
import { toast } from "react-toastify";
const fetcher = (url) => fetch(url).then((res) => res.json());
import bg2 from '../assets/img/previa.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../firebaseConfig.ts';
import formatCpf from '@brazilian-utils/format-cpf';
import { useLocation } from 'react-router-dom';
import SignaturePad from 'signature_pad';
// import SignatureCanvas from '../components/b2b_components/SignatureCanvascomponent';
export default function Home() {
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
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);
  const [qualproblema, setQualproblema] = useState("");
  const [parametro, setParametro] = useState('');
  const [assinatura, setAssinatura] = useState('');
  const [liberado, setLiberado] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [numerocasa, setNumerocasa] = useState("");
  const [complemento, setComplemento] = useState("");
  const [uf, setUF] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");

  // http://localhost:3000/cadastrohospede?hostel=jardimtrevo
  // http://localhost:3000/cadastrohospede?hostel=joaojorge

  const handleMostrarMais = () => {
    setMostrarTextoCompleto(!mostrarTextoCompleto);
  }
  const canvasRef = useRef(null);
  let signaturePad = useRef(null);

  const ufOptions = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  useEffect(() => {
    signaturePad.current = new SignaturePad(canvasRef.current);
  }, []);

  const handleSaveSignature = async () => {
    toast('Assinatura salva com sucesso!')
    const signatureImage = signaturePad.current.toDataURL();
    setAssinatura(signaturePad.current.toDataURL())
    setLiberado(true);
  };


  console.log(datanascimento)
  useEffect(() => {
    setParametro(router.query.hostel);
  }, [hospedes])

  const hostelscadastrados = [
    {
      parametro: '1',
      cnpj: '21.084.315/0001-34',
      razasocial: 'JULIANA AZEVEDO JACQUES',
      nomefantasia: 'HOSTEL DE LUZ',
      endereco: 'RUA JOSÉ PATERNO, 170 - VILA JOÃO JORGE - CAMPINAS-SP',
      telefone: '(19) 98422-2373',
      email: 'hosteldeluz@gmail.com'
    },
    {
      parametro: '2',
      cnpj: '48.937.041/0001-35',
      razasocial: 'JULIANA AZEVEDO JACQUES',
      nomefantasia: 'HOSTEL DE LUZ',
      endereco: 'RUA THOMAS ALVES BROWN, 212 JARDIM TREVO',
      telefone: '(19) 98422-2373',
      email: 'hosteldeluz@gmail.com'
    },
  ]

  const atthospoede = () => {
    if (parametro === undefined) { return toast.error('Parece que esse formulário não esta relacionado a nenhum hostel.') }
    let contador = 0;
    let errorOccurred = false;

    console.log(Name, telefone, datanascimento, saude, cidadania, rgFrenteImage, rgVersoImage, aceitotermos, aceitoregras,)
    if (Name === '' || telefone === '' || datanascimento === '' || saude === '' || cidadania === '' || rgFrenteImage === null || rgVersoImage === null || aceitotermos === '' || aceitoregras === '') {
      toast.error('Gentileza preencha todos os campos, coloque pelo menos um documento.')
    } else {
      if (hospedes.length === 0) {
        if (!errorOccurred) {
          errorOccurred = true;
          toast.success('Úsuario cadastrado!')
          onSubmit()
          router.push("/");
        }
      } else {
        hospedes?.map((item, index) => {
          let verdadeiro = item.passaporte === 'vazio';

          if (Name === '' || cpf === '' || telefone === '') {
            contador = contador + 1
            if (!errorOccurred) {
              errorOccurred = true;
              toast.error('gentileza preencha os campos!')
            }
          } else if (verdadeiro === true) {
            if (item.rg === rg || item.cpf === cpf) {
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
          } else {
            if (item.passaporte === passaporte) {
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
          }

        })
      }
    }
  };

  const onSubmit = async () => {
    let contador = 0;
    let contadorToast = 0;
    let imageArr = [];
    [...Array(3)]?.map((item, index) => {
      if (index === 2) {
        // Lógica para lidar com o item adicional (índice 2)
        const name = `fotodocumento${cpf}${index}`;
        const blob = dataURItoBlob(assinatura);
        const storageRef = ref(storage, `image/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            setProgressUpload(progress); // to show progress upload
          },
          (error) => {
            toast.error(error.message);
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              // url is download url of file
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

              if (3 === contador) {
                setTimeout(() => {
                  contador = 0;
                  dispararbanco(imageArr);
                }, 2000);
              }
            });
          }
        );
      } else {
        // Lógica para lidar com os arquivos
        const name = `fotodocumento${cpf}${index}`;
        const storageRef = ref(storage, `image/${name}`);
        let uploadTask;

        if (index === 0) {
          uploadTask = uploadBytesResumable(storageRef, rgFrenteImage);
        } else {
          uploadTask = uploadBytesResumable(storageRef, rgVersoImage);
        }

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            setProgressUpload(progress); // to show progress upload
          },
          (error) => {
            toast.error(error.message);
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              // url is download url of file
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

              if (3 === contador) {
                setTimeout(() => {
                  contador = 0;
                  dispararbanco(imageArr);
                }, 2000);
              }
            });
          }
        );
      }
    });
  };

  // Função para converter a string base64 em Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }



  const dispararbanco = async (imageArr) => {
    setTimeout(() => {
      router.push("/agradecimento");
    }, 3000)
    try {
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
        rgfrente: imageArr[2],
        rgverso: imageArr[1],
        assinatura: imageArr[0],
        aceitoregras: aceitoregras,
        observacoes: observacoes,
        formulario: parametro,
        qualproblema: qualproblema,
        datacadastro: new Date(),
        cep: cep,
        uf: uf,
        cidade: cidade,
        logradouro: logradouro,
        numerocasa: numerocasa,
        complemento: complemento,
        endereco: endereco,
        bairro: bairro,
      });


    } catch (error) {
      console.log(error)
    }


    mutate('/api/hospedes/getAllHospedes');
  }

  const handleClear = () => {
    signaturePad.current.clear();
  };
  return (
    <>

      {/* <!-- ec Banner Slider --> */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        centeredSlides={true}
        className="owl-carousel">
        <SwiperSlide >
          <div className="video-container" style={{ backgroundImage: `url('${bg2.src}')`, backgroundSize: 'cover' }}>
            <div className='backgroundprovisorio d-flex flex-column justify-content-center align-items-center p-0 pt-5 pb-5' style={{ width: '100vw', height: '100%' }}>
              <div className="row">

                <div className="col-12">

                  <div className="card card-default">

                    <div className="card-body container">
                      <div className="d-flex flex-column" style={{ width: '250px', margin: '0 auto' }}>
                        <Image
                          src={require('../assets/img/hostellogo.png')}
                          width={350} heigth={'auto'}
                          priority
                          alt=""
                          style={{ objectFit: 'cover' }}
                          className='rounded'
                        />
                      </div>
                      <h1 className="text-center mt-3">Seja Bem vindo!</h1>
                      <h3 className="text-center mb-3">Preencha o formulario abaixo para se cadastrar!</h3>
                      <div>
                        {hostelscadastrados?.map((item, index) => {
                          if (parametro === item.parametro) {
                            return (
                              <>
                                <p><b>CNPJ: </b>{item.cnpj}</p>
                                <p><b>Razão Social: </b>{item.razasocial}</p>
                                <p><b>Nome Fantasia: </b>{item.nomefantasia}</p>

                                <p><b>Endereço: </b>{item.endereco}</p>
                                <p><b>Telefone: </b>{item.telefone}</p>
                                <p><b>E-mail: </b>{item.email}</p>
                              </>
                            )
                          }
                        })}

                      </div>
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

                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="endereco" className="form-label">
                                Endereço
                              </label>
                              <input type="text"
                                onChange={(e) => setEndereco(e.target.value)}
                                className="form-control" id="endereco" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="numerocasa" className="form-label">
                                Nº
                              </label>
                              <input type="text"
                                onChange={(e) => setNumerocasa(e.target.value)}
                                className="form-control" id="numerocasa" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="complemento" className="form-label">
                                Complemento
                              </label>
                              <input type="text"
                                onChange={(e) => setComplemento(e.target.value)}
                                className="form-control" id="complemento" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="uf" className="form-label">
                                UF
                              </label>
                              <select
                                className="form-control"
                                id="uf"
                                value={uf}
                                onChange={(e) => setUF(e.target.value)}
                              >
                                <option value="" disabled>Selecione seu UF</option>
                                {ufOptions.map((ufOption) => (
                                  <option key={ufOption} value={ufOption}>
                                    {ufOption}
                                  </option>
                                ))}
                              </select>
                              <span style={{ position: 'relative', bottom: '32px', left: '95%', pointerEvents: "none" }}>▼</span>
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="cidade" className="form-label">
                                Cidade
                              </label>
                              <input type="text"
                                onChange={(e) => setCidade(e.target.value)}
                                className="form-control" id="cidade" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="bairro" className="form-label">
                                Bairro
                              </label>
                              <input type="text"
                                onChange={(e) => setBairro(e.target.value)}
                                className="form-control" id="bairro" />
                            </div>
                          </div>
                          <div className="col-md-6 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="cep" className="form-label">
                                CEP
                              </label>
                              <InputMask
                                mask="99999-999"
                                maskChar={null}
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                className="form-control"
                                id="cep"
                              />
                            </div>
                          </div>
                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="logradouro" className="form-label">
                                Logradouro
                              </label>
                              <input type="text"
                                onChange={(e) => setLogradouro(e.target.value)}
                                className="form-control" id="logradouro" />
                            </div>
                          </div>


                          <b className="text-start mt-3">As imagens do documento deve ser enviada apenas em formato de imagem (jpg, jpeg, png)*</b>
                          <div className="col-md-6 mt-3">
                            <label htmlFor="phone-1" className="form-label">
                              Foto Frente
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              accept=".png, .jpeg, .jpg, .pdf"
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
                              accept=".png, .jpeg, .jpg, .pdf"
                              id="phone-1"
                              style={{ border: 'none', minHeight: '30px' }}
                              onChange={(e) => setRgVersoImage(e.target.files[0])}
                            />
                            {rgVersoImage && (
                              <img src={URL.createObjectURL(rgVersoImage)} alt="Foto Verso" />
                            )}
                          </div>
                          <div className="col-md-12 mt-3">
                            <div className="col-md-12">
                              <label htmlFor="email" className="form-label">
                                Contato
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

                          <div className="col-md-12 mt-3">
                            <label className="form-label">Observações</label>
                            <textarea
                              rows={5}
                              className="slug-title text-black"
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
                          </div>


                          <div className="d-flex flex-column align-items-center mt-3">
                            <label className="form-label">Escreva sua assinatura aqui</label>
                            <div style={{ boxShadow: '0 0 10px' }} className="tamanhoassinaturadektop">
                              <canvas ref={canvasRef} height="200"></canvas>
                              <div className="btn btn-sm btn-primary qty_close" style={{ height: '30px' }} onClick={handleClear}>
                                <BsEraser size={20} style={{ marginRight: '10px' }} /> Limpar assinatura
                              </div>
                            </div>
                            <div className="col-md-12 mt-4 d-flex justify-content-center text-center">
                              <div
                                onClick={handleSaveSignature}
                                className="btn btn-sm btn-primary qty_close"
                                style={{ width: '250px' }}
                              >
                                Salvar Assinatura
                              </div>
                            </div>
                          </div>
                          {liberado === true ?
                            <div className="col-md-12 mt-4 d-flex justify-content-center text-center">
                              <div
                                onClick={(e) => atthospoede(e)}
                                className="btn btn-sm btn-primary qty_close"
                                style={{ width: '250px' }}
                              >
                                Enviar Cadastro!
                              </div>
                            </div>
                            :
                            <div className="col-md-12 mt-4 d-flex justify-content-center text-center ">
                              <div
                                onClick={(e) => toast.error('Salve sua assinatura!')}
                                className="btn btn-sm btn-primary qty_close fundo-vermelho"
                                style={{ width: '250px' }}
                              >
                                Enviar Cadastro!
                              </div>
                            </div>
                          }


                        </form>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>


    </>
  );
}
