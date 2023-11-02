import { useState } from "react";
import axios from "axios";
import useSwr, { mutate } from "swr";
import router from 'next/router'
import { toast } from "react-toastify";

function AddFaq() {
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState(0);

  const onSubmit = async (e) => {
    e.preventDefault();
    let data = await axios.post(`/api/faq/insertFaq/`, {
      question: faqQuestion,
      answer: faqAnswer,
    });
    toast('Faq sendo adicionado!', {
      position: "top-right",
      });
    mutate(`/api/faq/getAllFaq`);
    router.push("/b2b/faq");
  };

  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <h4>Adicionar Pergunta</h4>
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
                onChange={(e) => setFaqQuestion(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Resposta
            </label>
            <div className="col-12">
              <textarea
                name="answer"
                className="form-control here slug-title"
                type="text"
                onChange={(e) => setFaqAnswer(e.target.value)}
                rows={5}
              />
            </div>
          </div>


          <div className="row">
            <div className="col-12">
            <button name="submit" type="submit" className="btn btn-primary">
            Adicionar Pergunta
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddFaq;