import axios from "axios";
import router from 'next/router'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

function EditCategory({ despesasId, categoriadespesas, setShowEditCategoryComponent }) {
 
  const [id_, setId_] = useState(0);
  const [titulo, setDespesasName] = useState("");
  useEffect(() => {
    categoriadespesas?.map(item => {
      console.log(item)
      if (item._id === despesasId) {
        setDespesasName(item.titulo);
        setId_(item._id)
      }
    })
  }, [despesasId]);


  const onSubmit = async (e) => {
    e.preventDefault();
    router.push("/b2b/despesas");
    let data = await axios.put(`/api/categoriadespesas/updateCategoria?id=${id_}`, {
      titulo: titulo
    });
    toast('Categoria Despesa sendo editada!', {
      position: "top-right",
      });
    mutate(`/api/categoriadespesas/getAllCategoria`);
  };

  return (
    <div className="card-body">
      <div className="ec-cat-form">
        <div className="d-flex justify-content-between">
          <h4>Editar</h4>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              setShowEditCategoryComponent(false);
            }}
          > Nova </button>
        </div>
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
                value={titulo}
                onChange={(e) => setDespesasName(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
              Editar Categoria Despesa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditCategory;