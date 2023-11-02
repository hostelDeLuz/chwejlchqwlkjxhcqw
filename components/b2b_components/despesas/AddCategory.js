import { useState } from "react";
import axios from "axios";
import router from 'next/router'
import { toast } from "react-toastify";
import useSwr, { mutate } from "swr";
import { useCookies, expires } from 'react-cookie';
import { useEffect } from "react";
const fetcher = (url) => fetch(url).then((res) => res.json());
function AddDespesas() {
  const { data: allcategorias } = useSwr(`/api/categoriadespesas/getAllCategoria`, fetcher);
  const { data: allhostels } = useSwr(`/api/hoteis/getAllHotel`, fetcher);
  const [titulo, setDespesasName] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [hostel, sethostel] = useState("");
  const [dataAtual, setDataAtual] = useState("");
  const [cookies, setCookie] = useCookies(['user']);
  const [userhostel, setUserhostel] = useState('');
  useEffect(() => {
    setUserhostel(cookies.user_hostel)
  }, [cookies])
  const onSubmit = async (e) => {
   
    e.preventDefault();
    
    if(titulo === '' || categoria === '' || dataAtual === '' || valor === ''){
      toast.error('Preencha os campos corretamente!', {
        position: "top-right",
      });
    }else{
      toast('Despesa sendo adicionada!', {
        position: "top-right",
      });
      setTimeout(() => {
        router.reload();
      }, 3000)
      let data = await axios.post(`/api/despesas/insertDespesas`, {
        titulo: titulo,
        descricao: descricao,
        categoria: categoria,
        quantidade: quantidade,
        hostel: userhostel,
        entrada: dataAtual,
        valor: parseFloat(valor),
      });
    }

    mutate(`/api/despesas/getAllDespesas`);
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
        <h4>Adicionar Despesa</h4>
        <form onSubmit={onSubmit}>
          <div className="col-md-12 space-t-15 mt-3 py-1 pr-1 date-input">
            <label htmlFor="phone-2" className="form-label">
              Data
            </label>
            <input
              type="date"
              className="form-control slug-title"
              id="phone-2"
              onChange={(e) => setDataAtual(e.target.value)}
            />
            <span className="calendar-icon" style={{ top: '47px', right: '25px' }}></span>
          </div>
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
                onChange={(e) => { mascaraMoeda(e), setValor(e.target.value) }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="text" className="col-12 col-form-label">
              Categoria
            </label>
            <div className="col-12">
              <select onChange={(e) => setCategoria(e.target.value)} className="form-control here slug-title" name="select">
                <option value="geral">geral</option>
                {allcategorias?.map((item, index) => {
                  return (
                    <option key={item._id} value={item._id}>{item.titulo}</option>
                  )
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
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>


          <div className="row">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
                Adicionar Despesa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddDespesas;
