import { useState } from "react";
import axios from "axios";
import useSwr, { mutate } from "swr";
import router from 'next/router'
import { toast } from "react-toastify";

function AddDespesas() {
  const [titulo, setDespesasName] = useState("");

  const onSubmit = async (e) => {
    router.push('/b2b/despesas')
    const dataAtual = new Date(); // Obtém a data atual
    e.preventDefault();
    await axios.post(`/api/categoriadespesas/insertCategoria`, {
      titulo: titulo,
    });
    toast('Categoria Despesa sendo adicionada!', {
      position: "top-right",
      });
    mutate(`/api/categoriadespesas/getAllCategoria`);
  };

  

  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <h4>Adicionar Despesa</h4>
        <form onSubmit={onSubmit}>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Nome
            </label>
            <div className="col-12">
              <input
                id="text"
                name="text"
                className="form-control here slug-title"
                type="text"
                onChange={(e) => setDespesasName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
            <button name="submit" type="submit" className="btn btn-primary">
            Adicionar Categoria Despesa
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddDespesas;