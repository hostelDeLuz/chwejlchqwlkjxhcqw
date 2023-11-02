import axios from "axios";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";

import { toast } from "react-toastify";
import router from 'next/router';
import Link from "next/link";
import Image from "next/image";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];

import CrooperJs from '../../components/b2b_components/cropperbanner.js';

import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
import Cropper from 'cropperjs';
export default function AddBanners() {
  const [imageSrc, setImageSrc] = useState(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const [productName, setTitle] = useState("");
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
                  senGalery(imageArr)
                  router.push("/b2b/hoteis");
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
        toast('Aguarde hostel sendo adicionada!', {
          position: "top-right",
        });
      }
    })
  };

  const senGalery = async (Arr) => {

    let data = await axios.post(`/api/hoteis/insertHotel`, {
      titulo: productName,
      subtitulo: fullProductDescription,
      imagem: Arr,
      ativo: active,
    });
    router.push("/b2b/hoteis");
    mutate('/api/hoteis/getAllHotel');
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
        <Menu  parametro={'12'}/>
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <div>
                  <h1>Adicionar Hostel</h1>
                  <p className="breadcrumbs">
                    <span>
                      <Link href="/b2b/hoteis">Hostels</Link>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Adicionar Hostel
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
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                              </div>

                              <div className="col-md-12">
                                <label className="form-label">Sub-Titulo</label>
                                <input
                                  className="form-control"
                                  onChange={(e) => setDescription(e.target.value)}
                                  rows="4"
                                ></input>
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

                              <div style={{width: '100%', height: '100%', border: '5px solid #99999987'}}>
                              <CrooperJs fileall={file} setFile={setFile} handleFileChange={handleFileChange} imageSrc={imageSrc} setImageSrc={setImageSrc}/>
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
                              

                              <div className="col-md-12">
                                <button name="submit" type="submit" className="btn btn-primary">
                                  Adicionar Hostel
                                </button>
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
