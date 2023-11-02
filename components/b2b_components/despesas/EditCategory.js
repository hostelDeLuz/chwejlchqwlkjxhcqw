import axios from "axios";
import router from 'next/router'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsPencilFill } from "react-icons/bs";
import useSwr, { mutate } from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());

function EditCategory({ despesasId, despesas, setShowEditCategoryComponent }) {
  const { data: allcategorias } = useSwr(`/api/categoriadespesas/getAllCategoria`, fetcher);
  const { data: allhostels } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const [id_, setId_] = useState(0);
  const [titulo, setDespesasName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [entrada, setEntrada] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [hostel, sethostel] = useState("");
  useEffect(() => {
    despesas?.map(item => {
      if (item._id === despesasId) {
        setDespesasName(item.titulo);
        setDescricao(item.descricao);
        setEntrada(item.entrada);
        setId_(item._id);
        setValor(item.valor);
        setCategoria(item.categoria);
        setQuantidade(item.quantidade);
        sethostel(item.hostel);
      }
    })
  }, [despesasId]);


  const onSubmit = async (e) => {
    e.preventDefault();
    mutate(`/api/despesas/getAllDespesas`);
    router.reload();
    let data = await axios.put(`/api/despesas/updateDespesas?id=${id_}`, {
      titulo: titulo,
      descricao: descricao,
      categoria: categoria,
      quantidade: quantidade,
      hostel: hostel,
      entrada: entrada,
      valor: parseFloat(valor),
    });
    toast('Despesa sendo editada!', {
      position: "top-right",
      });
  };

  function mascaraMoeda(event) {
    const campo = event.target;
    const tecla = event.which || window.event.keyCode;
    const valor = campo.value.replace(/[^\d]+/gi, '').split('').reverse();
    let resultado = '';
    const mascara = '########.##'.split('').reverse();
  
    for (let x = 0, y = 0; x < mascara.length && y < valor.length;) {
      if (mascara[x] !== '#') {
        resultado += mascara[x];
        x++;
      } else {
        resultado += valor[y];
        y++;
        x++;
      }
    }
  
    campo.value = resultado.split('').reverse().join('');
  }
  

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
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Categoria
            </label>
            <div className="col-12">
              <select defaultValue={categoria} onChange={(e) => setCategoria(e.target.value)} className="form-control here slug-title" name="select">
                {allcategorias?.map((item, index) => {
                  return(
                    <option key={item._id} value={item._id}>{item.titulo}</option>
                    )
                  })}
                  <option value="geral">Geral</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Hostel
            </label>
            <div className="col-12">
              <select value={hostel} onChange={(e) => sethostel(e.target.value)} className="form-control here slug-title" name="select">
               
                {allhostels?.map((item, index) => {
                  if(item._id === hostel){
                    return(
                      <option key={item._id} value={item._id}>{item.titulo}</option>
                      )
                  }
                })}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Quantidade
            </label>
            <div className="col-12">
              <input
                id="text"
                name="text"
                className="form-control here slug-title"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Descrição
            </label>
            <div className="col-12">
              <textarea
              rows={6}
                id="text"
                name="text"
                className=" here slug-title"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Valor
            </label>
            <div className="col-12">
              <input
                id="text"
                name="text"
                className="form-control here slug-title"
                type="text"
                value={`R$ ${valor}`}
                onChange={(e) => {mascaraMoeda(e), setValor(e.target.value) }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
              Editar Despesa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditCategory;
