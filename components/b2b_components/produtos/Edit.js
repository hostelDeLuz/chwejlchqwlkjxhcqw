import axios from "axios";
import router from 'next/router'
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { mutate } from "swr";

import Image from 'next/image'

import CrooperJs from '../cropperProduto.js';

import { FaTrash } from "react-icons/fa";

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig.ts';

function EditProdutos({ produtosId, produtos, setShowEditProdutosComponent }) {
  const [produtosNome, setProdutosNome] = useState("");
  const [produtosValorCompra, setProdutosValorCompra] = useState('');
  const [produtosValorVenda, setProdutosValorVenda] = useState('');
  const [produtosEstoque, setProdutosEstoque] = useState(0);
  const [id_, setId_] = useState();

  const [imageToUpload, setImageToUpload] = useState([]);
  const [downloadURL, setDownloadURL] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);

  const [imageSrc, setImageSrc] = useState(null);
  const [imagemDelete, setImagemDelete] = useState([]);
  const [file, setFile] = useState([]);
  const imageInput = useRef();
  const miniImagePreview = useRef();

  const [addProdutos, setProdutos] = useState({
    nome: "",
    valorCompra: "",
    valorVenda: "",
    estoque: "",
    id: "",
  });

  useEffect(() => {

    setImageToUpload([]);
    produtos?.map(item => {
      if (item._id === produtosId) {
        setProdutosNome(item.nome);
        setProdutosValorCompra(item.valorCompra);
        setProdutosValorVenda(item.valorVenda);
        setProdutosEstoque(item.estoque);
        setId_(item._id)
        setFile(item.imagem);
        setProdutos({
          nome: item.nome,
          valorCompra: item.valorCompra,
          valorVenda: item.valorVenda,
          estoque: item.estoque,
          id: item._id,
        })
      }
    })
  }, [produtosId]);



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
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused')
                  break
                case 'running':
                  console.log('Upload is running')
                  break
              }
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
                    router.push("/b2b/produtos");
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
          toast('Aguarde produto sendo editado!', {
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
              toast('Aguarde Banner sendo editado!', {
                position: "top-right",
              });
            }


            contador = 0;
            setTimeout(() => {
              router.reload();
             }, 2000)
            let data = await axios.put(`/api/produtos/updateProdutos?id=${id_}`, {
              nome: produtosNome,
              valorCompra: parseFloat(produtosValorCompra),
              valorVenda: parseFloat(produtosValorVenda),
              estoque: produtosEstoque,
              imagem: file,
            });
            mutate('/api/produtos/getAllProdutos');

          }
        }
      }
    })
  };

  const senGalery = async (Arr) => {

    let filteredArr = Arr.filter(a => a.url !== undefined);
    setTimeout(() => {
     router.reload();
    }, 2000)

    await axios.put(`/api/produtos/updateProdutos?id=${id_}`, {
      nome: produtosNome,
      valorCompra: parseFloat(produtosValorCompra),
      valorVenda: parseFloat(produtosValorVenda),
      estoque: produtosEstoque,
      imagem: filteredArr,
    });

    mutate(`/api/produtos/getAllProdutos/`);
   

    toast('Produto sendo editado!', {
      position: "top-right",
    });

  }

  const customImgLoader = ({ src }) => {
    return `${src}`;
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    reader.readAsDataURL(file);
  };


  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <div className="d-flex justify-content-between">
          <h4>Editar</h4>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              setShowEditProdutosComponent(false);
            }}
          > Novo </button>
        </div>
        <form onSubmit={onSubmit} className="row d-flex flex-wrap">

          <div className="row col-12 col-lg-6">
            <div className="form-group row col-12">
              <label htmlFor="text" className="col-12 col-form-label">
                Nome
              </label>
              <div className="col-12">
                <input
                  name="nome"
                  className="form-control here slug-title"
                  type="text"
                  defaultValue={produtosNome}
                  onChange={(e) => setProdutosNome(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row col-12">
              <label htmlFor="text" className="col-12 col-form-label">
                Estoque
              </label>
              <div className="col-12">
                <input
                  name="estoque"
                  className="form-control here slug-title"
                  type="text"
                  defaultValue={produtosEstoque}
                  onChange={(e) => setProdutosEstoque(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group row col-12">
              <label htmlFor="text" className="col-12 col-form-label">
                Valor de Compra
              </label>
              <div className="col-12">
                <input
                  name="valorCompra"
                  className="form-control here slug-title"
                  type="text"
                  value={`R$ ${produtosValorCompra}`}
                  onChange={(e) => { mascaraMoeda(e), setProdutosValorCompra(e.target.value) }}
                />
              </div>
            </div>

            <div className="form-group row col-12">
              <label htmlFor="text" className="col-12 col-form-label">
                Valor de Venda
              </label>
              <div className="col-12">
                <input
                  name="valorVenda"
                  className="form-control here slug-title"
                  type="text"
                  value={`R$ ${produtosValorVenda}`}
                  onChange={(e) => { mascaraMoeda(e), setProdutosValorVenda(e.target.value) }}
                />
              </div>
            </div>
          </div>

          <div className="row col-12 col-lg-6">
            <div style={{ width: '100%', height: '100%', border: '2px solid #e3e3e3' }}>
              <CrooperJs fileall={file} setFile={setFile} handleFileChange={handleFileChange} imageSrc={imageSrc} setImageSrc={setImageSrc} />
            </div>
          </div>

          <div className="col-12">
            <div className="ec-vendor-img-upload">
              <div className="ec-vendor-main-img">
                <div className="avatar-upload">

                  <div className="thumb-upload-set colo-md-12 mb-5">
                    {file !== 0 &&
                      file?.map((item, index) => {
                        const blob = new Blob([item.imagem], { type: 'image/png' })
                        const img = URL.createObjectURL(blob);
                        return (
                          <div
                            key={index}
                            className="thumb-upload"
                          >
                            <div className="thumb-edit">
                              <button
                                type='button'
                                onClick={(e) => deleteImage(e, item.imagem)}
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
                                  src={item?.url || img}
                                  alt="edit"
                                  width={150}
                                  height={150}
                                  style={{ maxWidth: '180px', height: 'auto' }}
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

          <div className="row">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
                Editar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProdutos;