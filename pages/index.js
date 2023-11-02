import Image from 'next/image'
import Link from 'next/link'

import bg2 from '../assets/img/previa.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import useSwr from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {

  // const { data: banners } = useSwr(`/api/banners/getAllBanners`, fetcher);
  // const { data: subBanners } = useSwr(`/api/subBanners/getAllSubBanner`, fetcher);
  // const { data: promotions } = useSwr(`/api/promotions/getAllPromotions`, fetcher);
  // const { data: colors } = useSwr(`/api/colors/getAllColor`, fetcher);
  // const { data: sizes } = useSwr(`/api/product_sizes/getAllSizes`, fetcher);
  // const { data: mainCategories } = useSwr(`/api/category/getAllCategory`, fetcher);
  // const { data: products } = useSwr(`/api/products/getAllProducts`, fetcher);

  return (
    <>
      {/* <!-- ec Banner Slider --> */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        // autoplay={{
        //   delay: 3500,
        //   disableOnInteraction: false,
        // }}
        // loop={true}
        centeredSlides={true}
        className="owl-carousel">
        {/* <SwiperSlide >
          <div className="video-container" style={{ backgroundImage: `url('${bg1.src}')` }}>
            <video autoPlay muted loop id="background-video" className='col-12' style={{height: '100vh', objectFit: 'cover', zIndex: '9999', position: 'absolute'}}>
          <source src={'https://firebasestorage.googleapis.com/v0/b/naturescer-eco-resort.appspot.com/o/videos%2Fvideonovo.mp4?alt=media&token=df8a3a3f-47a0-4913-885c-63b5f3a02087'} type="video/mp4" />
        </video>
            <div className="video-overlay"></div>
          </div>
        </SwiperSlide>
        <SwiperSlide >
          <div className="video-container" style={{ backgroundImage: `url('${bg1.src}')` }}>
          </div>
        </SwiperSlide> */}
        <SwiperSlide >
          <div className="video-container" style={{ backgroundImage: `url('${bg2.src}')`, backgroundSize: 'cover' }}>
            <div className='backgroundprovisorio d-flex flex-column justify-content-center align-items-center' style={{ width: '100vw', height: '100vh' }}>
              <div>
                <Image
                  src={require('../assets/img/hostellogo.png')}
                  width={350} heigth={'auto'}
                  priority
                  alt=""
                  style={{ background: '#d9d9d9', objectFit: 'cover' }}
                  className='rounded'
                />
              </div>
              <div className='mt-5'><h1 style={{color: 'white', textShadow: '0 0 10px black'}}>Bem-vindos, obrigado pela sua visita!</h1></div>
              <div><h5 style={{color: 'white', textShadow: '0 0 10px black'}}>Estamos trabalhando para recebê-los em breve</h5></div>
              <div className='mt-5'><h5 style={{color: 'white', textShadow: '0 0 10px black'}}>Entre em contato</h5></div>
              <div className="social">
                <ul className='mobtextcenter'>
                  <li className='text-white' style={{fontSize: '18px', textShadow: '0 0 10px black'}}>Telefone: (19) 98422-2373</li>
                </ul>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>


    </>
  );
}
