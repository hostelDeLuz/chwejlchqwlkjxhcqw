import axios from "axios";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";

import { toast } from "react-toastify";
import Router from 'next/router';
import Link from "next/link";
import Image from "next/image";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import CrooperJs from '../../components/b2b_components/cropperbanner.js';
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
import router from 'next/router';
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

import Menu from "../../components/b2b_components/Menu";

export default function AddProduct() {
  const { data: hoteis } = useSwr(`/api/hoteis/getAllHotel`, fetcher);


  const [hotel, setHotel] = useState("");
  const [genero, setGenero] = useState("");
  const [qtdcamas, setQtdcamas] = useState(0);
  const [arrqtdcamas, setQtdarrcamas] = useState([]);

  const dispararbanco = async (arrayquartos) => {
    let data = await axios.post(`/api/quartos/insertQuarto`, {
      titulo: productName,
      camas: qtdcamas,
      arrCamas: arrayquartos,
      hotel: hotel,
      genero: genero,
      ativado: active,
    });
    mutate('/api/quartos/getAllQuarto');
  }

  const [imageSrc, setImageSrc] = useState(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const [productName, setProductName] = useState("");
  const [fullProductDescription, setDescription] = useState("");
  const [active, setActive] = useState(1);
  const [file, setFile] = useState([]);
  const imageInput = useRef();
  const miniImagePreview = useRef();


  const deleteImage = (e, imagem) => {
    e.preventDefault();

    file.forEach(async item => {
      if (item.image === imagem) {
        setFile(
          file.filter(a =>
            a.image !== imagem
          ));

      }
    })
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    let contador = 0;
    let imageArr = [];
    let contadorToast = 0;

    const date = new Date();
    let arrayquartos = [];
    {
      [...Array(parseFloat(qtdcamas))]?.map((item, index) => {
        arrayquartos.push([{ numeroCama: index + 1, limpeza: date, vago: false, hospede: '', entrada: '', saida: '', base: true, checkinID: '' }]);
      })
    }

    file.forEach(async item => {
      if (item.image) {
        const name = item.path
        const storageRef = ref(storage, `image/${name}`)
        const uploadTask = uploadBytesResumable(storageRef, item.image)

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

              if (file.length === contador) {
                setTimeout(() => {
                  contador = 0;
                  senGalery(imageArr, arrayquartos)
                  router.push("/b2b/quartos");
                }, 2000)
              }
            })
          },
        )
      } else {
        toast.error('File not found')
      }

      if (contadorToast === 0) {
        contadorToast++
        toast('Aguarde quarto sendo adicionada!', {
          position: "top-right",
        });
      }
    })
  };

  const senGalery = async (Arr, arrayquartos) => {

    let data = await axios.post(`/api/quartos/insertQuarto`, {
      titulo: productName,
      camas: qtdcamas,
      arrCamas: arrayquartos,
      imagem: Arr,
      hotel: hotel,
      genero: genero,
      ativado: active,
    });
    router.push("/b2b/quartos");
    mutate('/api/quartos/getAllQuarto');
  }

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
        <Menu  parametro={'11'}/>
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <div>
                  <h1>Adicionar Quarto</h1>
                  <p className="breadcrumbs">
                    <span>
                      <Link href="/b2b/quartos">Quartos</Link>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Adicionar Quarto
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
                              onSubmit={onSubmit}
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
                                  onChange={(e) => setProductName(e.target.value)}
                                />
                              </div>

                              <div className="col-md-4">
                                <label className="form-label">Hotel</label>
                                <select onChange={(e) => setHotel(e.target.value)}>
                                  <option value={''} selected></option>
                                  {hoteis?.map((item, index) => {
                                    return (
                                      <option key={index} value={item._id}>
                                        {item.titulo}
                                      </option>
                                    )
                                  })}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">Genero</label>
                                <select onChange={(e) => setGenero(e.target.value)}>
                                  <option value={''} selected></option>
                                  <option value={'masculino'} >Masculino</option>
                                  <option value={'feminino'}>Feminino</option>
                                  <option value={'unisex'}>Unisex</option>
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label">Quantidade de Camas</label>
                                <select onChange={(e) => setQtdcamas(e.target.value)}>
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
                                  <option value={11}>11</option>
                                  <option value={12}>12</option>
                                  <option value={13}>13</option>
                                  <option value={14}>14</option>
                                  <option value={15}>15</option>
                                </select>
                              </div>

                              <div style={{ width: '100%', height: '100%', border: '5px solid #99999987' }}>
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

                                      <div className="thumb-upload-set colo-md-12 mb-5">
                                        {file !== 0 &&
                                          file?.map((item, index) => {
                                            const blob = new Blob([item.image], { type: 'image/png' })
                                            const img = URL.createObjectURL(blob);

                                            return (
                                              <div
                                                key={index}
                                                className="thumb-upload"
                                              >
                                                <div className="thumb-edit">
                                                  <button
                                                    type='button'
                                                    onClick={(e) => deleteImage(e, item.image)}
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
                                                      className="image-thumb-preview ec-image-preview"
                                                      src={img}
                                                      alt="edit"
                                                      width={150}
                                                      height={150}
                                                      ref={miniImagePreview}
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex mb-3">
                                <div className="row align-items-center">
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
                              </div>

                              <div className="col-md-12">
                                <div onClick={(e) => onSubmit(e)} className="btn btn-primary">
                                  Adicionar Quarto
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