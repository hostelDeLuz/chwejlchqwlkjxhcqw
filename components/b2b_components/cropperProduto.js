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

        const file = new File([theBlob], fileName, { type: theBlob.type });
        const arr = Array.from(file)
        const reader = new FileReader();

        if (fileall.length >= 1) {
            toast.error('Adicione apenas uma imagem!', {
                position: "top-right",
            });
        } else if (arr.length === 0) {
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

    const handleImageLoad = () => {
        cropper.current = new Cropper(imageElement.current, {
            aspectRatio: 10 / 10,
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
        const filename = 'image.webp';

        const canvas = cropper.current.getCroppedCanvas();
        canvas.toBlob((blob) => {
            const img = new Image();
            img.onload = () => {
                const canvas2 = document.createElement('canvas');
                const ctx = canvas2.getContext('2d');
                canvas2.width = img.width;
                canvas2.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const newDataUrl = canvas2.toDataURL('image/webp', 0.5);
                const newBlob = dataURLtoBlob(newDataUrl);
                const storage = getStorage();
                const storageRef = ref(storage, 'testeImage');
                blobToFile(newBlob, "testedearray");
                cropper.current.destroy()
            };
            img.src = URL.createObjectURL(blob);

        }, 'image/webp');
    };

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
                    <FaPhotoVideo size={40} className='mt-2' />
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
        </div>
    );
};

export default ImageCropper;