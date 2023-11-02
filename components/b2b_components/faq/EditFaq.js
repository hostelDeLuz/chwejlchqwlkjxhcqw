import axios from "axios";
import router from 'next/router'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

function EditFaq({ faqId, faq, setShowEditFaqComponent }) {
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState(0);
  const [id_, setId_] = useState();

  const [addFaq, setFaq] = useState({
    question: "",
    answer: "",
    id: "",
  });

  useEffect(() => {
    faq?.map(item => {
      if (item._id === faqId) {

        setFaqQuestion(item.question);
        setFaqAnswer(item.answer);
        setId_(item._id)
        setFaq({
          question: item.question,
          answer: item.answer,
          id: item._id,
        })

      }
    })
  }, [faqId]);



  const onSubmit = async (e) => {
    e.preventDefault();
    let data = await axios.put(`/api/faq/updateFaq?id=${id_}`, {
      question: faqQuestion,
      answer: faqAnswer,
    });
    toast('Faq sendo editado!', {
      position: "top-right",
      });
    mutate(`/api/faq/getAllFaq/`);
    router.push("/b2b/faq");
    setFaq({
      question: "",
      answer: "",
      id: "",
    });
  };

  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <div className="d-flex justify-content-between">
          <h4>Editar</h4>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              setShowEditFaqComponent(false);
            }}
          > Nova </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Pergunta
            </label>
            <div className="col-12">
              <input
                name="question"
                className="form-control here slug-title"
                type="text"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
              />
            </div>
          </div>

          <label htmlFor="text" className="col-12 col-form-label">
            Resposta
          </label>
          <div className="col-12">
            <textarea
              name="answer"
              className="form-control here slug-title"
              type="text"
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              rows={5}
            />
          </div>

          <div className="row">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
              Editar Pergunta
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
 )
}

export default EditFaq;