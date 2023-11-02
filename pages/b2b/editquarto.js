import axios from "axios";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";

import { toast } from "react-toastify";
import Router from 'next/router';
import Link from "next/link";
import Image from "next/image";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
import CrooperJs from '../../components/b2b_components/cropperbanner.js';
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

import Menu from "../../components/b2b_components/Menu";

export default function Editquarto({ id }) {
  const { data: quarto } = useSwr(`/api/quartos/getAllQuarto`, fetcher)
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher)
  let idmongo = Router.query.id;
  const [objid, setObjid] = useState("");
  const [productName, setProductName] = useState("");
  const [hotel, setHotel] = useState("");
  const [genero, setGenero] = useState("");
  const [qtdcamas, setQtdcamas] = useState(0);
  const [arrqtdcamas, setQtdarrcamas] = useState([]);
  const [active, setActive] = useState(1);
  const [imageSrc, setImageSrc] = useState(null);
  const [imagemDelete, setImagemDelete] = useState([]);
  const [file, setFile] = useState([]);
  const [imageToUpload, setImageToUpload] = useState([]);
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const imageInput = useRef();
  const miniImagePreview = useRef();

  useEffect(() => {
    idmongo = Router.query.id;
    quarto?.map((item, index) => {
      if (item._id === idmongo) {
        setObjid(item._id)
        setProductName(item.titulo)
        setHotel(item.hotel)
        setGenero(item.genero)
        setFile(item.imagem);
        setQtdcamas(item.camas)
        setQtdarrcamas(item.arrCamas)
        setActive(item.ativado)
      }
    })
  }, [])

  const onsubmit = (objid) => {
    let arrnovo = arrqtdcamas;
    const date = new Date();
    let contador = 0;
    let contadorToast = 0;
    let imageArr = file;

    if (imagemDelete.length > 0) {
      imagemDelete.forEach(item => {
        const desertRef = ref(storage, `image/${item.delete.path}`);

        deleteObject(desertRef).then(() => {
          // File deleted successfully
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
      })
    }

    [...Array(parseFloat(qtdcamas))]?.map((item, index) => {
      if (arrqtdcamas.length === 0) {
        arrnovo.push([{ numeroCama: index + 1, entrada: date, vago: false, hospede: '', base: true, checkinID: '', limpeza: '', saida: '' }])
      } else {
        if (arrqtdcamas.length < index + 1) {
          contador++
          arrnovo.push([{ numeroCama: index + 1, entrada: date, vago: false, hospede: '', base: true, checkinID: '', limpeza: '', saida: '' }])
        } else {
          contador++
        }
        if (parseFloat(qtdcamas) === index + 1) {
          file.forEach(async item => {
            if (item.blobs === true) {
              if (item.image) {
                const name = item.path;
                const storageRef = ref(storage, `image/${name}`);
                const uploadTask = uploadBytesResumable(storageRef, item.image);
                uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgressUpload(progress) // to show progress upload
                  },
                  (error) => {
                    alert(error.message)
                  },
                  () => {
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

                      if (file.length > 0) {
                        setTimeout(() => {
                          contador = 0;
                          dispararbanco(obj, arrnovo)
                          Router.push("/b2b/quartos");
                        }, 2000)
                      }
                    })
                  },
                )
              } else {
                alert('File not found')
              }

              if (contadorToast === 0) {
                contadorToast++
                toast('Aguarde Quarto sendo editado!', {
                  position: "top-right",
                });
              }
            } else {
              contador++
              {
                if (contador === file.length) {
                  contador = 0;

                  if (contadorToast === 0) {
                    contadorToast++
                    toast('Aguarde Quarto sendo editado!', {
                      position: "top-right",
                    });
                  }


                  contador = 0;
                  let data = await axios.post(`/api/quartos/updateQuarto?id=${objid}`, {
                    titulo: productName,
                    camas: qtdcamas,
                    arrCamas: arrqtdcamas,
                    imagem: file,
                    hotel: hotel,
                    genero: genero,
                    ativado: active,
                  });
                  mutate('/api/quartos/getAllQuarto');
                  Router.push("/b2b/quartos");

                }
              }
            }
          })
        }
      }
    })

  }

  const dispararbanco = async (imarr, arrayquartos) => {
    let data = await axios.post(`/api/quartos/updateQuarto?id=${objid}`, {
      titulo: productName,
      camas: qtdcamas,
      arrCamas: arrayquartos,
      imagem: imarr,
      hotel: hotel,
      genero: genero,
      ativado: active,
    });
    mutate('/api/quartos/getAllQuarto');
  }

  const removercama = (numerocama) => {
    let contador = 0;
    arrqtdcamas?.map((item, index) => {
      item?.map((item2, index) => {
        if (item2.numeroCama === numerocama && arrqtdcamas.length <= item2.numeroCama) {
          setQtdcamas(arrqtdcamas.length - 1);
          setQtdarrcamas(
            arrqtdcamas?.filter(a =>
              a[0].numeroCama !== numerocama
            ));
        } else {
          contador++
        }
      })

      if (arrqtdcamas.length === contador - 1) {
        contador++
        alert('Retire apenas o último quarto da lista!')
      }
    })
  }

  const customImgLoader = ({ src }) => {
    return `${src}`;
  };

  const deleteImage = (e, imagem2) => {
    e.preventDefault();

    file.forEach(async item => {
      if (item.path === imagem2) {
        setImagemDelete((current) => [
          ...current,
          {
            delete: item
          },
        ]);
        setFile(
          file.filter(a =>
            a.path !== imagem2
          ));
      }
    })
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  };


  return (
    <div style={{ backgroundColor: '#f3f3f3' }}>
      <div style={{ display: 'flex' }}>
        <Menu  parametro={'11'} />
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <div>
                  <h1>Editar Quarto</h1>
                  <p className="breadcrumbs">
                    <span>
                      <Link href="/b2b/quartos">Quartos</Link>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Editar Quarto
                  </p>
                </div>
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
                                  Título
                                </label>
                                <input
                                  type="text"
                                  className="form-control slug-title"
                                  id="inputEmail4"
                                  value={productName}
                                  onChange={(e) => setProductName(e.target.value)}
                                />
                              </div>

                              <div className="col-md-4">
                                <label className="form-label">Hotel</label>
                                <select onChange={(e) => setHotel(e.target.value)}>
                                  {hoteis?.map((item, index) => {
                                    if (item._id === hotel) {
                                      return (
                                        <option selected key={index} value={item._id}>
                                          {item.titulo}
                                        </option>
                                      )
                                    } else {
                                      return (
                                        <option key={index} value={item._id}>
                                          {item.titulo}
                                        </option>
                                      )
                                    }

                                  })}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">Genero</label>
                                <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                                  <option value={''} selected></option>
                                  <option value={'masculino'} selected>Masculino</option>
                                  <option value={'feminino'}>Feminino</option>
                                  <option value={'unisex'}>Unisex</option>

                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">Quantidade de Camas</label>
                                <select value={qtdcamas} onChange={(e) => setQtdcamas(e.target.value)}>
                                  <option value={1} selected>1</option>
                                  <option value={2} >2</option>
                                  <option value={3}>3</option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                  <option value={6}>6</option>
                                  <option value={7}>7</option>
                                  <option value={8}>8</option>
                                  <option value={9}>9</option>
                                  <option value={10}>10</option>
                                </select>
                              </div>

                              <div style={{ width: '100%', height: '100%', border: '2px solid #e3e3e3' }}>
                                <CrooperJs fileall={file} setFile={setFile} handleFileChange={handleFileChange} imageSrc={imageSrc} setImageSrc={setImageSrc} />
                              </div>


                              <div className="col-lg-12">
                                <div className="ec-vendor-img-upload">
                                  <div className="ec-vendor-main-img">
                                    <div className="avatar-upload">

                                      {/* <div className="d-flex flex-column align-items-center mb-5">
                                        <h1>Selecione ou Arraste suas imagens</h1>
                                        <FileUploader
                                          multiple={true}
                                          handleChange={handleChange}
                                          name="file"
                                          types={fileTypes}
                                        />
                                      </div> */}

                                      <div className="thumb-upload-set colo-md-12">
                                        {quarto?.map((item, index) => {
                                          if (item._id === idmongo) {
                                            return (
                                              <div key={index}>
                                                {file?.map((item2, index) => {
                                                  const blob = new Blob([item2.image], { type: 'image/jpg' })
                                                  const img = URL.createObjectURL(blob);

                                                  if (item2.image === '') {
                                                    return;
                                                  } else {

                                                    return (
                                                      <div
                                                        key={index}
                                                        className="thumb-upload"
                                                      >

                                                        <div className="thumb-edit">
                                                          <button
                                                            type='button'
                                                            onClick={(e) => deleteImage(e, item2.path)}
                                                            className="save-image-button btn p-2"
                                                          >
                                                            <FaTrash
                                                              size={20}
                                                              color={"#d93b3b"}
                                                              className="ec-image-upload"
                                                            />
                                                          </button>
                                                        </div>
                                                        <div className="thumb-preview ec-preview">
                                                          <div className="image-thumb-preview">
                                                            <Image
                                                              loader={customImgLoader}
                                                              className="image-thumb-preview ec-image-preview"
                                                              src={item2.url || img}
                                                              alt="Product Image"
                                                              width={500}
                                                              height={500}
                                                            />
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  }
                                                })}
                                              </div>
                                            );
                                          }
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-12 d-flex justify-content-center mb-3">
                                <div className="col-10 d-flex justify-content-center align-items-center" style={{ height: '200px', border: '2px solid #e3e3e3' }}>
                                  {arrqtdcamas?.map((item, index) => (
                                    item?.map((item3, index2) => {
                                      if (item3.vago === true) {
                                        return (
                                          <div key={index} style={{ position: 'relative' }}>
                                            <Image width={70} height={70} className='pl-3 pr-3' style={{ opacity: '0.5' }} src={require('../../assets/img/cama-de-solteiro.png')} />
                                            <div className="circulocama d-flex flex-column" style={{ position: 'absolute', fontWeight: '700' }}>
                                              {item3.numeroCama}
                                              <p>{item3.vago ? item3.hospede : 'Liberado'}</p>
                                              <p><FaTrash /></p>
                                            </div>
                                          </div>
                                        )
                                      } else if (item.length === 1) {
                                        return (
                                          <div key={index} style={{ position: 'relative' }} onClick={() => removercama(item3.numeroCama)}>
                                            <Image width={70} height={70} className='pl-3 pr-3' style={{ opacity: '0.5' }} src={require('../../assets/img/cama-de-solteiro.png')} />
                                            <div className="circulocama d-flex flex-column" style={{ position: 'absolute', fontWeight: '700' }}>
                                              {item3.numeroCama}
                                              <p>{item3.vago ? item3.hospede : 'Liberado'}</p>
                                              <p><FaTrash /></p>
                                            </div>
                                          </div>
                                        )
                                      }
                                    })

                                  ))}
                                </div>
                              </div>
                              <div className="d-flex mb-3">
                                <div className="row align-items-center">
                                  <label className="form-label">Ativado</label>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    {active === '1' ?
                                      <input
                                        type="radio"
                                        name="active"
                                        value={1}
                                        defaultChecked
                                        style={{ width: '20px', margin: '0 15px 0 0' }}
                                        onChange={(e) => setActive(e.target.value)}
                                      />
                                      :
                                      <input
                                        type="radio"
                                        name="active"
                                        value={1}
                                        style={{ width: '20px', margin: '0 15px 0 0' }}
                                        onChange={(e) => setActive(e.target.value)}
                                      />
                                    }
                                    Sim
                                  </div>
                                  <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                    {active === '0' ?
                                      <input
                                        type="radio"
                                        name="active"
                                        value={0}
                                        defaultChecked
                                        style={{ width: '20px', margin: '0 15px 0 0' }}
                                        onChange={(e) => setActive(e.target.value)}
                                      />
                                      :
                                      <input
                                        type="radio"
                                        name="active"
                                        value={0}
                                        style={{ width: '20px', margin: '0 15px 0 0' }}
                                        onChange={(e) => setActive(e.target.value)}
                                      />
                                    }
                                    Não
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-12">
                                <div onClick={() => onsubmit()} className="btn btn-primary">
                                  Editar Quarto
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