import { useState, useEffect } from 'react';
import cn from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation]);

function Calendario({ arrdatas }) {
  const hoje = new Date();
  const [activeSlide, setActiveSlide] = useState(hoje.getMonth() + hoje.getFullYear() * 12);
  const mesAtual = activeSlide % 12 + 1;
  const anoAtual = Math.floor(activeSlide / 12);
  const [entradaStr, setEntradaStr] = useState(`${hoje.getFullYear()}-${(mesAtual).toString().padStart(2, '0')}-01`);
  const [saidaStr, setSaidaStr] = useState(`${hoje.getFullYear()}-${(mesAtual).toString().padStart(2, '0')}-${new Date(anoAtual, mesAtual, 0).getDate().toString().padStart(2, '0')}`);
  let arraydedatas = Array.isArray(arrdatas) ? arrdatas : [];
  const entrada = new Date(entradaStr);
  const saida = new Date(saidaStr);
  useEffect(() => {
    const diasMes = new Date(anoAtual, mesAtual, 0).getDate();
    if (entrada.getDate() > diasMes) {
      setEntradaStr(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-01`);
    }
    if (saida.getDate() > diasMes) {
      setSaidaStr(`${anoAtual}-${mesAtual.toString().padStart(2, '0')}-${diasMes.toString().padStart(2, '0')}`);
    }
  }, [arraydedatas]);

  const isDiaPeriodo = (dia, mes, ano) => {
    const diaDate = new Date(ano, mes - 1, dia);
    return arraydedatas.some(
      ({ entrada, saida }) =>
        diaDate.getTime() >= new Date(entrada).getTime() && diaDate.getTime() <= new Date(saida).getTime()
    );
  };

  const diasMeses = [];

  for (let ano = hoje.getFullYear(); ano <= hoje.getFullYear() + 1; ano++) {
    for (let mes = 1; mes <= 12; mes++) {
      // Verifica se o mês atual já passou
      if (ano < hoje.getFullYear() || (ano === hoje.getFullYear() && mes < hoje.getMonth() + 1)) {
        continue;
      }

      const diasMes = Array.from({ length: new Date(ano, mes, 0).getDate() }, (_, i) => i + 1);
      diasMeses.push({ ano, mes, diasMes });
    }
  }

  const meses = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
  };
  
  const getHospedeByDate = (ano, mes, dia) => {
    const diaDate = new Date(ano, mes - 1, dia);
    const reserva = arraydedatas.find(
      ({ entrada, saida }) => diaDate >= new Date(entrada) && diaDate <= new Date(saida)
    );
    const hospede = reserva ? reserva.hospede : '';
    return hospede.length > 15 ? hospede.slice(0, 11) + '...' : hospede;
  };


  return (
    <div style={{margin: '30px 0'}}>

      <Swiper navigation className='calendario-container'>
        {diasMeses.map(({ ano, mes, diasMes }) => (
          <SwiperSlide key={`${ano}-${mes}`}>
            <h3>{meses[mes]} de {ano}</h3>
            <div className="calendario">
              {diasMes.map((dia) => (
                <div
                  key={`${ano}-${mes}-${dia}`}
                  className={cn('calendario-dia', {
                    'calendario-dia-periodo': isDiaPeriodo(dia, mes, ano)
                  })}
                >
                  {dia}
                  <div className='calendario-dia-hospede'>
                    {getHospedeByDate(ano, mes, dia)}
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Calendario;