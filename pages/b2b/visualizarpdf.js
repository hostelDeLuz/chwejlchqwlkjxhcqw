import axios from "axios";
import Image from 'next/image';
import { useEffect, useState } from "react";
import Link from "next/link";
import router from 'next/router';
import { FaTrash, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import Header from "../../components/b2b_components/Header";
import Menu from "../../components/b2b_components/Menu";
import Footer from "../../components/b2b_components/Footer";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Jobs() {
    const [listImages, setlistImages] = useState();
    const [selecionado, setSelecionado] = useState();
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    return (
        <div style={{ backgroundColor: '#f3f3f3' }}>
            <div style={{ display: 'flex' }}>
                <Menu parametro={'16'}/>
                <div className="ec-page-wrapper">
                    <div className="ec-content-wrapper">
                        <div className="content">
                            <div className="breadcrumb-wrapper d-flex align-items-center justify-content-between">
                                <div>
                                    <h1>PDFs de treinamento</h1>
                                    <p className="breadcrumbs">
                                        <span>
                                            <Link href="/b2b">Dashboard</Link>
                                        </span>
                                        <span>
                                            <i className="mdi mdi-chevron-right"></i>
                                        </span>
                                        PDFs de treinamento
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="card card-default">
                                        <div className="card-body">
                                            <div className="table-responsive">

                                                <table
                                                    id="responsive-data-table"
                                                    className="table"
                                                    style={{ width: "100%" }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th>Nome</th>
                                                            <th>Descrição</th>
                                                            <th>Arquivo</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>


                                                        <tr className="align-middle">
                                                            <td>
                                                                Pdf de exemplo
                                                            </td>
                                                            <td>
                                                                Esse é um pdf de exemplo para testar o funcionamento do sistema
                                                            </td>
                                                            <td className="d-flex justify-content-center">
                                                                <div style={{ width: '50px', height: '50px', display: 'flex', marginLeft: '5px' }} className='flex-row align-items-center'>
                                                                    <a href='https://firebasestorage.googleapis.com/v0/b/hostel-de-luz.appspot.com/o/pdf%2FPDF-teste.pdf?alt=media&token=b1ec4e98-9853-44ec-8b2d-e6b197338075' target='_blank' rel='noreferrer'>
                                                                        <FaFilePdf size={50} />
                                                                    </a>
                                                                </div>
                                                            </td>


                                                        </tr>
                                                        <tr className="align-middle">
                                                            <td>
                                                                Pdf de exemplo
                                                            </td>
                                                            <td>
                                                                Esse é um pdf de exemplo para testar o funcionamento do sistema
                                                            </td>
                                                            <td className="d-flex justify-content-center">
                                                                <div style={{ width: '50px', height: '50px', display: 'flex', marginLeft: '5px' }} className='flex-row align-items-center'>
                                                                    <a href='https://firebasestorage.googleapis.com/v0/b/hostel-de-luz.appspot.com/o/pdf%2FPDF-teste.pdf?alt=media&token=b1ec4e98-9853-44ec-8b2d-e6b197338075' target='_blank' rel='noreferrer'>
                                                                        <FaFilePdf size={50} />
                                                                    </a>
                                                                </div>
                                                            </td>


                                                        </tr>
                                                        <tr className="align-middle">
                                                            <td>
                                                                Pdf de exemplo
                                                            </td>
                                                            <td>
                                                                Esse é um pdf de exemplo para testar o funcionamento do sistema
                                                            </td>
                                                            <td className="d-flex justify-content-center">
                                                                <div style={{ width: '50px', height: '50px', display: 'flex', marginLeft: '5px' }} className='flex-row align-items-center'>
                                                                    <a href='https://firebasestorage.googleapis.com/v0/b/hostel-de-luz.appspot.com/o/pdf%2FPDF-teste.pdf?alt=media&token=b1ec4e98-9853-44ec-8b2d-e6b197338075' target='_blank' rel='noreferrer'>
                                                                        <FaFilePdf size={50} />
                                                                    </a>
                                                                </div>
                                                            </td>


                                                        </tr>
                                                        <tr className="align-middle">
                                                            <td>
                                                                Pdf de exemplo
                                                            </td>
                                                            <td>
                                                                Esse é um pdf de exemplo para testar o funcionamento do sistema
                                                            </td>
                                                            <td className="d-flex justify-content-center">
                                                                <div style={{ width: '50px', height: '50px', display: 'flex', marginLeft: '5px' }} className='flex-row align-items-center'>
                                                                    <a href='https://firebasestorage.googleapis.com/v0/b/hostel-de-luz.appspot.com/o/pdf%2FPDF-teste.pdf?alt=media&token=b1ec4e98-9853-44ec-8b2d-e6b197338075' target='_blank' rel='noreferrer'>
                                                                        <FaFilePdf size={50} />
                                                                    </a>
                                                                </div>
                                                            </td>


                                                        </tr>


                                                    </tbody>
                                                </table>

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
