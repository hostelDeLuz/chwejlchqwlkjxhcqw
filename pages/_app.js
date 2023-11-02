import { useEffect } from "react";

import "../styles/globals.css";

import "../assets/css/plugins/animate.css";
import "../assets/css/plugins/swiper-bundle.min.css";
import "../assets/css/plugins/slick.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import "../assets/css/custom.css";

import "../assets/css/index.css";

import "../assets/css/demo2.css";
import "../assets/css/ekka.css";
import "../assets/plugins/simplebar/simplebar.css";

/* PAGES STYLES */
import "../styles/aboutUsPage.css";
import "../styles/allProductsPage.css";
import "../styles/contactPage.css";
import "../styles/storesPage.css";
import "../styles/doubtsPage.css";
import "../styles/userProfilePage.css";
import "../styles/cartPage.css";
import "../styles/trackOrderPage.css";
import "../styles/checkoutPage.css";
import "../styles/productPage.css";
import "../styles/loginPage.css";
import "../styles/registerPage.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckoutArr } from "../Context";

import NextCors from 'nextjs-cors';
import Head from "next/head";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  // const { Checkout } = useContext(CheckoutArr);
  const [array, setArray] = useState([]);
  const [buscaArr, setBuscaArr] = useState('');
  const [cartProd, setCartProd] = useState([])
  const [searchData, setSearchData] = useState([])
  const endereco = 'Rua fictícia para teste, 637, Serra Negra - SP';
  const telefone = '(19) 123456789';
  const cnpj = '12.123.123/0001-10';
  const email = 'contato@bellasnatural.com.br';

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require("jquery/dist/jquery.min.js");
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content="Hostel de Luz " />
        <meta name="keywords" content="oi" />
        <meta name="author" content="Frequência (Júnior, Lucas e Victor)" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hostel de Luz</title>
        <meta property="og:title" content="Hostel de Luz" />
        <meta property="og:description" content="Hostel de Luz - Campinas" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="../public/favicon.ico"/>
        
      </Head>
      <CheckoutArr.Provider
        value={{ array, setArray, setBuscaArr, buscaArr, cartProd, setCartProd, searchData, setSearchData, telefone, endereco, cnpj, email }}>
        <Component {...pageProps} />
      </CheckoutArr.Provider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default MyApp
