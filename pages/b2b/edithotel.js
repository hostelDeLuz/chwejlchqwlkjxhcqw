import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router'
import Router from 'next/router';
const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import axios from "axios";
import { BsPencilFill } from "react-icons/bs";
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());
import CrooperJs from '../../components/b2b_components/cropperbanner.js';

export default function EditProduct() {
  const { data: hotel } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const [imageToUpload, setImageToUpload] = useState([]);
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const [productName, setProductName] = useState("");
  const [fullProductDescription, setFullProductDescription] = useState("");
  const [active, setActive] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [imagemDelete, setImagemDelete] = useState([]);
  const [file, setFile] = useState([]);
  const imageInput = useRef();
  const miniImagePreview = useRef();

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    setImageToUpload([]);
    hotel?.forEach(item => {
      if (item._id === id) {
        setProductName(item.titulo);
        setFullProductDescription(item.subtitulo);
        setFile(item.imagem);
        setActive(item.ativo)
      }
    })
  }, []);


  const onSubmit = async (e) => {
    e.preventDefault();
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

                if (file.length === contador) {
                  setTimeout(() => {
                    contador = 0;
                    senGalery(imageArr)
                    Router.push("/b2b/hoteis");
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
          toast('Aguarde Hostel sendo editado!', {
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
              toast('Aguarde Hostel sendo editado!', {
                position: "top-right",
              });
            }


            contador = 0;
            let data = await axios.put(`/api/hoteis/updateHotel?id=${id}`, {
              titulo: productName,
              subtitulo: fullProductDescription,
              imagem: file,
              ativo: active,
            });
            mutate('/api/hoteis/getAllHotel');
            Router.push("/b2b/hoteis");

          }
        }
      }
    })
  };

  const senGalery = async (Arr) => {

    let filteredArr = Arr.filter(a => a.url !== undefined);
    let data = await axios.put(`/api/hoteis/updateHotel?id=${id}`, {
      titulo: productName,
      subtitulo: fullProductDescription,
      imagem: filteredArr,
      ativo: active,
    });
    mutate('/api/hoteis/getAllHotel');
    Router.push("/b2b/hoteis");

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
        <Menu parametro={'12'}/>
        <div className="ec-page-wrapper">
          <div className="ec-content-wrapper">
            <div className="content">
              <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                <div>
                  <h1>Editar Hostel</h1>
                  <p className="breadcrumbs">
                    <span>
                      <Link href="/b2b/hoteis">Hostels</Link>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    Editar Hostel
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
                              {hotel?.map((item, index) => {
                                if (item._id === id) {
                                  return (
                                    <>
                                      <div className="col-md-12" key={index}>
                                        <label htmlFor="inputEmail4" className="form-label">
                                          Título
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control slug-title"
                                          id="inputEmail4"
                                          defaultValue={item.titulo}
                                          onChange={(e) => setProductName(e.target.value)}
                                        />
                                      </div>

                                      <div className="col-md-12">
                                        <label className="form-label">Descrição Completa</label>
                                        <textarea
                                          defaultValue={item.subtitulo}
                                          onChange={(e) => setFullProductDescription(e.target.value)}
                                          rows="4"
                                        ></textarea>
                                      </div>

                                      <div className="d-flex mb-3">
                                        <div className="row align-items-center">
                                          <label className="form-label">Ativado</label>
                                          <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                            {item.ativo === '1' ?
                                              <input
                                                type="radio"
                                                name="active"
                                                defaultChecked
                                                value={1}
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
                                            {item.ativo === '0' ?
                                              <input
                                                type="radio"
                                                name="active"
                                                defaultChecked
                                                value={0}
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
                                            }Não
                                          </div>
                                        </div>

                                      </div>
                                    </>
                                  )
                                }
                              })}

                              <div style={{ width: '100%', height: '100%', border: '2px solid #e3e3e3' }}>
                                <CrooperJs fileall={file} setFile={setFile} handleFileChange={handleFileChange} imageSrc={imageSrc} setImageSrc={setImageSrc} />
                              </div>


                              <div className="col-lg-12">
                                <div className="ec-vendor-img-upload">
                                  <div className="ec-vendor-main-img">
                                    <div className="avatar-upload">

                                      <div className="thumb-upload-set colo-md-12">
                                        {hotel?.map((item, index) => {
                                          if (item._id === id) {
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

                              <div className="col-md-12">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                  name="submit"
                                >
                                  Editar Hostel
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
