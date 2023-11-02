import { useState, useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebaseConfig.ts';
import { FaPhotoVideo } from "react-icons/fa";
const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];
import 'cropperjs/dist/cropper.min.css';
import { toast } from "react-toastify";
const ImageCropper = ({ setFile, fileall, handleFileChange, imageSrc, setImageSrc }) => {
    const [croppedImage, setCroppedImage] = useState(null);
    const imageElement = useRef(null);
    const cropper = useRef(null);

    function blobToFile(theBlob, fileName) {
        // cria um novo arquivo a partir do objeto Blob
        const file = new File([theBlob], fileName, { type: theBlob.type });

        const arr = Array.from(file)
        const reader = new FileReader();

        if(fileall.length >= 1){
            toast.error('Adicione apenas uma imagem!', {
                position: "top-right",
              });
        }else if (arr.length === 0) {
            setFile((current) => [
                ...current,
                {
                    image: file,
                    path: Math.floor(Math.random() * (1000000000 + 10)),
                    blobs: true,
                },
            ]);
        } else {
            setFile((current) => [
                ...current,
                {
                    image: file,
                    path: Math.floor(Math.random() * (1000000000 + 10)),
                    blobs: true,
                },
            ]);
            return;
        }
    }

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();

    //     reader.onload = () => {
    //         setImageSrc(reader.result);
    //     };

    //     reader.readAsDataURL(file);
    // };

    const handleImageLoad = () => {
        cropper.current = new Cropper(imageElement.current, {
            aspectRatio: 20 / 9,
            minContainerHeight: 500,
            crop: () => {
                const canvas = cropper.current.getCroppedCanvas();
                canvas.toBlob((blob) => {
                    setCroppedImage(blob);
                });
            },
        });
    };

    const handleDownload = () => {
        const filename = 'image.jpg';

        // Obter o Blob da imagem cortada
        const canvas = cropper.current.getCroppedCanvas();
        canvas.toBlob((blob) => {
            // Criar um novo objeto Image
            const img = new Image();
            img.onload = () => {
                // Carregar a imagem em um novo canvas
                const canvas2 = document.createElement('canvas');
                const ctx = canvas2.getContext('2d');
                canvas2.width = img.width;
                canvas2.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                // Obter a nova versão da imagem em uma string de dados com qualidade reduzida
                const newDataUrl = canvas2.toDataURL('image/jpeg', 0.5);
                // Criar um novo Blob a partir da string de dados
                const newBlob = dataURLtoBlob(newDataUrl);
                // Enviar o novo Blob para o Firebase Storage
                const storage = getStorage();
                const storageRef = ref(storage, 'testeImage');
                blobToFile(newBlob, "testedearray");
                cropper.current.destroy()
                // uploadBytesResumable(storageRef, newBlob).then((snapshot) => {
                //     console.log('Uploaded a blob or file with reduced quality!');
                // });

            };
            img.src = URL.createObjectURL(blob);

        }, 'image/jpeg');
    };


    // Função auxiliar para criar um Blob a partir de uma string de dados
    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    return (
        <div>
            {/* <input className='mt-3' type="file" onChange={handleFileChange} /> */}
            <div className='mt-3 mb-2 refinputdiv'>
                    <label for="inputTag">
                        Selecionar Imagem (Arraste ou Clique Aqui!) <br />
                        <FaPhotoVideo size={40} className='mt-2'/>
                        <input id="inputTag" type="file" onChange={handleFileChange} />
                        <br />
                        <span id="imageName"></span>
                    </label>
                </div>
            <div>
                {imageSrc && (
                    <img
                        ref={imageElement}
                        src={imageSrc}
                        alt="Crop"
                        onLoad={handleImageLoad}
                        style={{ display: 'none' }}
                        width={400}
                        height={225}
                    />
                )}
                <button type='button' onClick={handleDownload} className="btn btn-primary mt-4 mb-3">
                    Recortar Imagem
                </button>
                
            </div>
            {/* {croppedImage && (
        <div>
          <h2>Cropped Image:</h2>
          <img
            src={URL.createObjectURL(croppedImage)}
            alt="Cropped"
            width={400}
            height={225}
          />
          
        </div>
      )} */}
        </div>
    );
};

export default ImageCropper;