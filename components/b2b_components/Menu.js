import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { useCookies, expires } from 'react-cookie';
import Menumobile from './MenuMobile';
import { useEffect, useState } from "react";
import { FiMenu } from 'react-icons/fi';
import {
  FaUserAlt,
  FaBookmark,
  FaStarHalfAlt,
  FaLaptop,
  FaKeycdn,
  FaRegQuestionCircle,
  FaPowerOff,
  FaUsers,
  FaHotel,
} from "react-icons/fa";
import {
  BsFileLock,
  BsCalendar2Check,
  BsFillPersonCheckFill,
  BsBookmarkX,
  BsBookmarkPlus,
  BsBookmarkDash
} from "react-icons/bs"
import {
  BiBed
} from "react-icons/bi"
import {
  GiMoneyStack,
  GiPayMoney,
  GiReceiveMoney,
  GiBroom
} from "react-icons/gi"
import {
  MdCategory
} from "react-icons/md"
import {
  MdProductionQuantityLimits,
  BiBookAdd,
  MdSell
} from "react-icons/md"
import {
  AiFillFilePdf
} from "react-icons/ai"


export default function Menu({ parametro }) {
  const [cookies, setCookie] = useCookies(['user']);
  const [level, setLevel] = useState('10');
  const [user, setUser] = useState('10');
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setLevel(cookies.user_level)
    setUser(cookies.user_login)
  }, [cookies])

  function clearCookies() {
    setCookie("access_token", "", { path: '/' });
    setCookie("user_id", ``, { path: '/' });
    setCookie("user_login", ``, { path: '/' });
    setCookie("user_level", ``, { path: '/' });
    setCookie("user_hostel", ``, { path: '/' });
    return router.push("/b2b/login");
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="menu-icon estilomenuflutuante" onClick={toggleMenu}>
        <FiMenu size={25} />
      </div>
      <div className="d-none d-lg-block" style={{ width: '400px' }}></div>
      <div
        className={`ec-left-sidebar ec-bg-sidebar posicaomenumob ${isOpen && 'posicaomenumobshow'}`}
        style={{ backgroundColor: "#FFF", borderRight: "1px solid #F3F3F3" }}
      >

        <div id="sidebar" className="sidebar ec-sidebar-footer p-0">
          <div className="ec-brand">
            <Link href="/b2b/" style={{ margin: '0 auto' }}>
              <Image style={{ maxWidth: '200px', padding: '15px' }} width={500} src={require('../../assets/img/hostellogo.png')} alt="Logo Hotel de Luz" />
            </Link>
            <div className="menu-icon estilomenuflutuante d-lg-none d-block" onClick={toggleMenu}>
              <FiMenu size={25} />
            </div>
          </div>
          <div className="ec-navigation overflow-auto tramanhodocumento" data-simplebar>

            <ul className="nav sidebar-inner" id="sidebar-menu">
              <li>
                    <Link
                      className="sidenav-item-link2"
                      href="/b2b/customers"
                    >
                      <FaUserAlt size={24} />
                      <span className="nav-text" >{user}</span>
                    </Link>
                  </li>
                  <hr />
              {level === '20' || level === '50' || level === '40' ?
                <>

                  <li className={parametro === '2' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/customers"
                    >
                      <FaLaptop size={24} />
                      <span className="nav-text" >Check-in Ativos</span>
                    </Link>
                  </li>


                  <li className={parametro === '3' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/customersallactive"
                    >
                      <FaUsers size={24} />
                      <span className="nav-text">Todos os Check-ins</span>
                    </Link>
                  </li>


                  {/* <li className={parametro === '4' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/customerscadastro"
                    >
                      <BsFillPersonCheckFill size={24} />
                      <span className="nav-text">Novo Hóspede</span>
                    </Link>
                  </li> */}

                  <li className={parametro === '5' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/hospedesall"
                    >
                      <FaUsers size={24} />
                      <span className="nav-text">Todos os Hóspedes</span>
                    </Link>
                  </li>
                  <hr />
                </>
                :
                <></>
              }

              {level === '20' || level === '50' || level === '40' ?
                <>
                  {level === '50' || level === '40' ? <hr /> : <></>}
                  <li className={parametro === '17' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/produtos"
                    >
                      <MdProductionQuantityLimits size={24} />
                      <span className="nav-text">Produtos</span>
                    </Link>
                  </li>

                  <li className={parametro === '18' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/pedido-novo"
                    >
                      <BsBookmarkPlus size={24} />
                      <span className="nav-text">Nova Comanda</span>
                    </Link>
                  </li>

                  <li className={parametro === '19' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/pedidos-abertos"
                    >
                      <BsBookmarkDash size={24} />
                      <span className="nav-text">Comandas Abertas</span>
                    </Link>
                  </li>

                  <li className={parametro === '20' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/pedidos-fechados"
                    >
                      <BsBookmarkX size={24} />
                      <span className="nav-text">Comandas Finalizadas</span>
                    </Link>
                  </li>

                  <li className={parametro === '22' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/pedido-avulso"
                    >
                      <MdSell size={24} />
                      <span className="nav-text">Venda Por Fora</span>
                    </Link>
                  </li>
                  {level === '50' || level === '40' ?
                    <li className={parametro === '25' ? `active` : ``}>
                      <Link
                        className="sidenav-item-link"
                        href="/b2b/financeiroloja"
                      >
                        <GiReceiveMoney size={24} />
                        <span className="nav-text">Financeiro Loja</span>
                      </Link>
                    </li>

                    : <></>}

                  <hr />
                </>
                :
                <></>
              }


              {level === '20' || level === '50' || level === '40' ?
                <>
                  <li className={parametro === '6' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/Trocadecama"
                    >
                      <GiBroom size={24} />
                      <span className="nav-text">Troca de Roupa Cama</span>
                    </Link>
                  </li>
                  <li className={parametro === '16' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/visualizarpdf"
                    >
                      <AiFillFilePdf size={24} />
                      <span className="nav-text">PDFs</span>
                    </Link>
                  </li>
                </>
                :
                <></>
              }


              {level === '40' || level === '50' ?
                <>

                  <hr />
                  <li className={parametro === '7' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/financeiro"
                    >
                      <GiMoneyStack size={24} />
                      <span className="nav-text">Financeiro Hóspedes</span>
                    </Link>
                  </li>
                  <hr />
                </>
                :
                <></>
              }

              {level === '20' || level === '50' || level === '40' ?
                <>
                <li className={parametro === '9' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/categoriadespesas"
                    >
                      <MdCategory size={24} />
                      <span className="nav-text">Categoria Despesas</span>
                    </Link>
                  </li>
                  <li className={parametro === '8' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/despesas"
                    >
                      <GiPayMoney size={24} />
                      <span className="nav-text">Despesas</span>
                    </Link>
                  </li>
                </>
                :
                <></>
              }



              {level === '40' || level === '50' ?
                <>

                  <li className={parametro === '10' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/financeirodespesas"
                    >
                      <GiReceiveMoney size={24} />
                      <span className="nav-text">Financeiro Despesas</span>
                    </Link>
                  </li>
                  <hr />

                  <li className={parametro === '11' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/quartos"
                    >
                      <BiBed size={24} />
                      <span className="nav-text">Quartos</span>
                    </Link>
                  </li>

                  <li className={parametro === '12' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/hoteis"
                    >
                      <FaHotel size={24} />
                      <span className="nav-text">Hostels</span>
                    </Link>
                  </li>
                  <hr />
                  <li className={parametro === '16' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/access"
                    >
                      <FaStarHalfAlt size={24} />
                      <span className="nav-text">Acessos</span>
                    </Link>
                  </li>
                  <hr />
                </>
                :
                <></>
              }


              {level === '10' || level === '40' || level === '50' ?
                <>
                  <li className={parametro === '13' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/faq"
                    >
                      <FaRegQuestionCircle size={24} />
                      <span className="nav-text">Perguntas FAQ</span>
                    </Link>
                  </li>

                  <li className={parametro === '14' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/policy_privacy"
                    >
                      <BsFileLock size={24} />
                      <span className="nav-text">Política de Privacidade</span>
                    </Link>
                  </li>

                  <li className={parametro === '15' ? `active` : ``}>
                    <Link
                      className="sidenav-item-link"
                      href="/b2b/terms_responsibility"
                    >
                      <FaKeycdn size={24} />
                      <span className="nav-text">Termos e Responsabilidade</span>
                    </Link>
                  </li>
                </>
                :
                <></>}

              <li className="d-none"></li>
            </ul>
          </div>
          <div className="btn-off"><a className="text-start mr-3 ml-3"><FaPowerOff onClick={() => clearCookies()} size={30} /></a></div>
        </div>
      </div>
    </>
  );
}
