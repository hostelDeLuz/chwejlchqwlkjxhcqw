import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { useCookies, expires } from 'react-cookie';
import { FiMenu } from 'react-icons/fi';
import { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaBars,
  FaBookmark,
  FaStarHalfAlt,
  FaLaptop,
  FaKeycdn,
  FaRegQuestionCircle,
  FaPowerOff,
  FaUsers,
  FaHotel
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


export default function MenuMobile({ parametro }) {
  const [cookies, setCookie] = useCookies(['user']);
  const [level, setLevel] = useState('10');

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setLevel(cookies.user_level)
  }, [cookies])


  function clearCookies() {
    setCookie("access_token", "", { path: '/' });
    setCookie("user_id", ``, { path: '/' });
    setCookie("user_login", ``, { path: '/' });
    setCookie("user_level", ``, { path: '/' });
    setCookie("user_hostel", ``, { path: '/' });
    return router.push("/b2b/login");
  }

  return (
    <>
       <div className="menu-container">
      <div className="logo">Imagem</div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link href="/" passHref>
              <div>Home</div>
            </Link>
          </li>
          <li>
            <Link href="/projetos" passHref>
              <div>Projetos</div>
            </Link>
          </li>
          <li>
            <Link href="/contato" passHref>
              <div>Contato</div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <FiMenu />
      </div>
      <style jsx>{`
        .menu-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          background-color: #f1f1f1;
        }

        .logo {
          font-weight: bold;
        }

        .menu {
          display: none;
        }

        .menu.open {
          display: block;
        }

        .menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .menu li {
          margin-bottom: 10px;
        }

        .menu a {
          color: #333;
          text-decoration: none;
        }

        .menu-icon {
          font-size: 24px;
          cursor: pointer;
        }
      `}</style>
    </div>

    </>
  );
}
