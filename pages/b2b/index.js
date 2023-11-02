import Link from "next/link";

import useSWR from "swr";

import { useState, useEffect } from "react";

import Modal from "../../components/b2b_components/ModalOrder";
import Menu from "../../components/b2b_components/Menu";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function PendingOrder() {

 
  return (
    <div className="d-flex">
      <Menu />
      <div className="mt-6">
        <h1 className="mb-4 mt-6">Seja Bem Vindo!</h1>
        <h2>Painel administrativo Hostel de Luz.</h2>
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
};