import axios from "axios";
import Image from 'next/image';
import { useEffect, useState } from "react";
import Link from "next/link";
import useSwr, { mutate } from "swr";
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
export default function Home() {


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
          <div className="video-container" style={{ backgroundImage: `url('${bg2.src}')`, backgroundSize: 'cover', height: '100vh' }}>
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
                      <h1 className="text-center mt-3">Seja Bem vindo ao Hostel de Luz!</h1>
                      <h4 className="text-center mb-3 mt-3">Obrigado por se cadastrar, visite nossa redes sociais!</h4>
                      <div className="d-flex justify-content-center">
                        <div className="p-2">
                          <a href='https://www.instagram.com/hosteldeluz/' target='_blank' rel='noreferrer'>
                          <Image
                            src={require('../assets/img/instagram.png')}
                            width={50}
                            priority
                            alt=""
                            style={{ objectFit: 'cover', width: '50px' }}
                            className='rounded'
                          />
                          </a>
                        </div>
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
