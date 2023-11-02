import axios from "axios";
import { Link } from "next/link";
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import router from 'next/router'
import AddFaq from "../../components/b2b_components/faq/AddFaq";
import EditFaq from "../../components/b2b_components/faq/EditFaq";

import Menu from "../../components/b2b_components/Menu";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function FAQ() {
  const [faqEditId, setFaqEditId] = useState("");
  const [faqInfo, setFaqInfo] = useState([]);
  const [showEditFaqComponent, setShowEditFaqComponent] = useState(false);

  const { data: faq } = useSwr(`/api/faq/getAllFaq`, fetcher);

  var tamanho = faq?.length || [];

  const deleteFaq = async (id) => {
    let data = await axios.delete(`/api/faq/deleteFaq?id=${id}`);
    mutate(`/api/faq/getAllFaq`);
    router.push("/b2b/faq");
  };

  return (
    <>
      <div style={{ backgroundColor: '#f3f3f3' }}>
        <div style={{ display: 'flex' }}>
          <Menu  parametro={'13'}/>
          <div className="ec-page-wrapper">
            <div className="ec-content-wrapper">
              <div className="content">
                <div className="breadcrumb-wrapper breadcrumb-wrapper-2 breadcrumb-contacts">
                  <h1>FAQ</h1>
                  <p className="breadcrumbs">
                    <span>
                      <a href="#">Dashboard</a>
                    </span>
                    <span>
                      <i className="mdi mdi-chevron-right"></i>
                    </span>
                    FAQ
                  </p>
                </div>
                <div className="row">
                <div className="col-lg-12">
                    <div className="ec-cat-list card card-default mb-24px">
                      <div className="card-body">
                        {showEditFaqComponent !== true ? (
                          <AddFaq />
                        ) : (
                          <EditFaq faqId={faqEditId} faq={faq} setShowEditFaqComponent={setShowEditFaqComponent}/>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ol-lg-12">
                    <div className="ec-cat-list card card-default">
                      <div className="card-body">
                        <div className="table-responsive">
                          {tamanho === 0 && (
                            <div className="text-center">
                              Não possui nenhuma pergunta cadastrada
                            </div>
                          )}

                          {tamanho !== 0 && (
                            <table id="responsive-data-table" className="table table-striped">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Pergunta</th>
                                  <th></th>
                                </tr>
                              </thead>

                              <tbody>
                                {faq?.map((item) => {
                                  return (
                                    <tr key={item.id} className="align-middle">
                                      <td>{item.id}</td>
                                      <td>{item.question}</td>
                                      <td className="text-right">
                                        <div className="btn-group">
                                          <button
                                            type="value"
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                              setFaqEditId(item._id);
                                              setShowEditFaqComponent(true);
                                            }}
                                          >
                                            <BsPencilFill />
                                          </button>
                                          <button
                                            className="btn btn-outline-primary delete-btn"
                                            onClick={() => deleteFaq(item._id)}
                                          >
                                            <FaTrash color="#d93b3b" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
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
    </>
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