import axios from "axios";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";

import { toast } from "react-toastify";
import router from 'next/router';
import Link from "next/link";
import Image from "next/image";
import { FaEdit, FaCheck, FaTrash } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";


import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

import Header from "../../components/b2b_components/Header";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";

export default function AddProduct() {
    const { data: terms_responsibility } = useSwr(`/api/terms/getAllTerms`, fetcher);
    const [termsResponsibility, settermsResponsibility] = useState("");
    const [active, setActive] = useState(1);
    const [_id, setId] = useState();
    useEffect(() => {
        terms_responsibility?.map(item => { settermsResponsibility(item.text) })
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();

        let data = await axios.put(`/api/terms/updateTerms?id=${_id}`, {
            text: termsResponsibility,
            active: active,

        });
        toast.success("Termos editados com sucesso!")
        router.push("/b2b/terms_responsibility");

    };

    return (
        <div style={{ backgroundColor: '#f3f3f3' }}>
            <div style={{ display: 'flex' }}>
                <Menu  parametro={'15'}/>
                <div className="ec-page-wrapper">
                    <div className="ec-content-wrapper">
                        <div className="content">
                            <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                                <h1>Termos e Responsabilidade</h1>
                                <p className="breadcrumbs">
                                    <span>
                                        <Link href="/b2b">Dashboard</Link>
                                    </span>
                                    <span>
                                        <i className="mdi mdi-chevron-right"></i>
                                    </span>
                                    Termos e Responsabilidade
                                </p>
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
                                                            {terms_responsibility?.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <div className="col-md-12">
                                                                            <label className="form-label">Escreva abaixo</label>
                                                                            <textarea
                                                                                style={{ whiteSpace: 'pre-wrap', }}
                                                                                
                                                                                defaultValue={item.text}
                                                                                onChange={(e) => settermsResponsibility(e.target.value)}
                                                                                rows="15"
                                                                            ></textarea>
                                                                        </div>
                                                                        <div className="d-flex mb-3">
                                                                            <div className="row align-items-center">
                                                                                <label className="form-label">Ativado</label>
                                                                                {item.active === 1 ?
                                                                                    <>
                                                                                        <div className="col-auto d-flex align-items-center" style={{ height: '50px' }}>
                                                                                            <input
                                                                                                type="radio"
                                                                                                name="active"
                                                                                                defaultChecked
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
                                                                                    </>
                                                                                    :
                                                                                    <>
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
                                                                                                defaultChecked
                                                                                                value={0}
                                                                                                style={{ width: '20px', margin: '0 15px 0 0' }}
                                                                                                onChange={(e) => setActive(e.target.value)}
                                                                                            />
                                                                                            Não
                                                                                        </div>
                                                                                    </>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <button onClick={() => setId(item._id)} name="submit" type="submit" className="btn btn-primary">
                                                                                Adicionar Política
                                                                            </button>
                                                                        </div>
                                                                    </>)
                                                            })}
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
  };