import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Info, WhatsappLogo } from "@phosphor-icons/react";
import FaqList from "../components/FaqList";
import AssemblyParts from "../components/AssemblyParts";
import { asset, wa } from "../config";
import "../assembly.css";

// Página do serviço "Montagem completa" (card da área gamer), com a atmosfera de gelo azul
// das referências de God of War Ragnarök. Cores e tipografia ficam isoladas em assembly.css.
// Cada seção explicativa tem um personagem grande ao lado e as explicações em cards de fala.

const builderPath = "/gamer/monte-seu-pc";
const helpLink = wa(
  "Olá! Quero ajuda para montar meu PC gamer. Gostaria de conversar sobre os jogos que pretendo jogar e meu orçamento.",
);

// Artes dos personagens: o usuário coloca os arquivos em public/assets/ e informa o nome aqui.
// Com null, o espaço do personagem continua reservado, sem imagem.
const characterArt = {
  hero: null,
  atreus: null,
  kratos: null,
};

const goals = [
  ["Seus jogos", "Quais jogos você quer rodar? Vamos começar por eles."],
  ["Seu monitor", "Qual monitor você usa ou pretende comprar? A resolução e a taxa de atualização influenciam a escolha das peças."],
  ["Além dos jogos", "Vai trabalhar, estudar, editar ou fazer lives nesse PC? Isso também conta."],
  ["Seu orçamento", "Quanto pretende investir? A Capucho ajuda a escolher as prioridades."],
];

const parts = [
  ["Processador", "Escolha um processador para os seus jogos e tarefas. Ele precisa ser compatível com a placa-mãe."],
  ["Placa de vídeo", "Considere os jogos, a resolução e a qualidade gráfica que você quer alcançar."],
  ["Memória RAM", "É o espaço de trabalho dos jogos e programas. Capacidade e padrão precisam combinar com a configuração."],
  ["SSD", "É onde ficam seus jogos e arquivos. Confira espaço, conexão e velocidade de carregamento."],
  ["Fonte", "Não escolha só pelos watts. Qualidade, potência e conectores precisam atender ao conjunto."],
  ["Refrigeração e gabinete", "As peças precisam caber e trabalhar bem refrigeradas. Espaço e circulação de ar importam."],
];

const steps = [
  ["Escolha seu caminho", "Selecione as peças no montador ou peça ajuda à Capucho para definir a configuração."],
  ["Confira o conjunto", "A Capucho confirma compatibilidade, disponibilidade, valor e prazo pelo WhatsApp."],
  ["Aprove o orçamento", "Confira a proposta. A montagem só começa com a sua aprovação."],
  ["Preparação e entrega", "A Capucho monta e testa o computador antes da entrega."],
];

const care = [
  ["Conferência das peças", "A Capucho verifica a compatibilidade dos componentes."],
  ["Pronto para usar", "O PC sai da loja com o Windows licenciado e os programas instalados."],
  ["Já comprou suas peças?", "A Capucho também pode montar com elas, após verificar compatibilidade e condições."],
  ["Montagem grátis", "Comprando as peças com a Capucho, a montagem não tem custo."],
];

const faq = [
  ["Posso levar peças que já comprei?", "Sim. A Capucho verifica a compatibilidade e as condições das peças antes de realizar a montagem."],
  ["Vocês me ajudam a escolher os componentes?", "Sim. Conte quais jogos e programas pretende usar, qual monitor tem e quanto quer investir. A gente ajuda a avaliar a configuração."],
  ["O preço do montador é definitivo?", "Não. Os valores são estimados. O orçamento final e a disponibilidade das peças são confirmados pelo WhatsApp antes da aprovação."],
  ["Qual é o prazo para a montagem?", "O prazo é informado junto com o orçamento, considerando a configuração e a disponibilidade das peças."],
  ["A montagem é cobrada à parte?", "Não, se você comprar as peças com a Capucho: nesse caso, a montagem é gratuita. Se você já tem os componentes, o valor da montagem é informado no orçamento."],
  ["O Windows e os programas já vêm instalados?", "Sim. O PC sai da loja com o Windows licenciado e os programas instalados, pronto para usar."],
];

function Actions() {
  return (
    <div className="asm-actions">
      <Link className="asm-button asm-button-primary" to={builderPath}>
        Escolher minhas peças
        <ArrowRight size={20} weight="bold" />
      </Link>
      <a
        className="asm-button asm-button-ghost"
        href={helpLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsappLogo size={21} />
        Quero ajuda para montar
      </a>
    </div>
  );
}

// Personagem grande ao lado das falas, com a base dissolvida na névoa.
function Speaker({ who }) {
  const art = characterArt[who.toLowerCase()];
  return (
    <div className={art ? "asm-speaker" : "asm-speaker is-empty"}>
      {art && <img src={asset(art)} alt="" loading="lazy" decoding="async" />}
      <p className="asm-nameplate">{who}</p>
    </div>
  );
}

// Seção explicativa: título, personagem de um lado e cards de fala do outro.
// As falas são textos originais da página, não citações do jogo.
function StageSection({ id, title, who, side, layout, character, children }) {
  return (
    <section className={`asm-section asm-stage asm-${id}`} aria-labelledby={`asm-${id}-title`}>
      <div className="asm-container">
        <h2 id={`asm-${id}-title`}>{title}</h2>
        <div className={`asm-stage-grid is-${side}`}>
          {character ?? <Speaker who={who} />}
          <div className="asm-stage-body">
            <ul className={`asm-says is-${layout} from-${side}`} data-who={who}>
              {children}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Say({ who, title, number, children }) {
  return (
    <li className="asm-say">
      {number && (
        <span className="asm-say-number" aria-hidden="true">
          {number}
        </span>
      )}
      <span className="asm-say-who">{who}</span>
      <h3>{title}</h3>
      <p>“{children}”</p>
    </li>
  );
}

export default function AssemblyPage() {
  return (
    <div className="assembly-page">
      <section className="asm-hero">
        <div className={characterArt.hero ? "asm-container asm-hero-grid" : "asm-container asm-hero-grid is-solo"}>
          <div className="asm-hero-copy">
            <Link className="asm-back" to="/gamer">
              <ArrowLeft size={17} />
              Área gamer
            </Link>
            <h1>
              Seu próximo PC começa com as <em>escolhas certas.</em>
            </h1>
            <Actions />
            <p className="asm-perk">
              <span>Montagem grátis</span> comprando as peças com a Capucho.
            </p>
          </div>
          {characterArt.hero && (
            <div className="asm-hero-art">
              <img
                src={asset(characterArt.hero)}
                alt="Kratos e Atreus"
                fetchPriority="high"
              />
            </div>
          )}
        </div>
      </section>

      <StageSection
        id="goals" title="Que jornada você quer encarar?" who="Atreus" side="left" layout="grid"
        character={
          <div className="asm-goals-character">
            <img
              src={asset("atreus-jornada.webp")}
              srcSet={`${asset("atreus-jornada-360.webp")} 360w, ${asset("atreus-jornada-600.webp")} 600w, ${asset("atreus-jornada.webp")} 1024w`}
              sizes="(max-width: 767px) 180px, (max-width: 1023px) 30vw, 340px"
              width="1024"
              height="1536"
              alt="Atreus olhando e gesticulando para os cards de planejamento à direita"
              loading="lazy"
              decoding="async"
            />
            <p className="asm-nameplate">Atreus</p>
          </div>
        }
      >
        {goals.map(([title, text]) => (
          <Say key={title} who="Atreus" title={title}>
            {text}
          </Say>
        ))}
      </StageSection>

      <section className="asm-section asm-stage asm-parts" aria-labelledby="asm-parts-title">
        <div className="asm-container">
          <h2 id="asm-parts-title">
            Força sozinha <em>não resolve.</em>
          </h2>
          <AssemblyParts cards={parts} />
        </div>
      </section>

      <section className="asm-section asm-stage asm-process" aria-labelledby="asm-process-title">
        <div className="asm-container">
          <h2 id="asm-process-title">Um plano claro antes de começar.</h2>
          <div className="asm-stage-grid is-left">
            <div className="asm-process-character">
              <img
                src={asset("kratos-plano.webp")}
                srcSet={`${asset("kratos-plano-360.webp")} 360w, ${asset("kratos-plano-600.webp")} 600w, ${asset("kratos-plano.webp")} 989w`}
                sizes="(max-width: 767px) 170px, (max-width: 1280px) 36vw, 420px"
                width="989"
                height="1591"
                alt="Kratos olhando e gesticulando para as etapas à direita"
                loading="lazy"
                decoding="async"
              />
              <p className="asm-nameplate">Kratos</p>
            </div>
            <div className="asm-stage-body">
              <ol className="asm-says is-list from-left">
                {steps.map(([title, text], i) => (
                  <Say key={title} who="Kratos" title={title} number={String(i + 1).padStart(2, "0")}>
                    {text}
                  </Say>
                ))}
              </ol>
              <p className="asm-note">
                <Info size={19} aria-hidden="true" />
                Valores estimados. Preço final, disponibilidade e prazo são confirmados pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StageSection
        id="care" title="A montagem termina quando o conjunto está pronto." who="Atreus" side="right" layout="stagger"
        character={
          <div className="asm-care-character">
            <img
              src={asset("atreus-pronto.webp")}
              srcSet={`${asset("atreus-pronto-360.webp")} 360w, ${asset("atreus-pronto-600.webp")} 600w, ${asset("atreus-pronto.webp")} 1024w`}
              sizes="(max-width: 767px) 180px, (max-width: 1023px) 30vw, 340px"
              width="1024"
              height="1536"
              alt="Atreus olhando e gesticulando para os cards sobre os cuidados da montagem à esquerda"
              loading="lazy"
              decoding="async"
            />
            <p className="asm-nameplate">Atreus</p>
          </div>
        }
      >
        {care.map(([title, text]) => (
          <Say key={title} who="Atreus" title={title}>
            {text}
          </Say>
        ))}
      </StageSection>

      <section className="asm-section asm-faq" aria-labelledby="asm-faq-title">
        <div className="asm-container asm-faq-grid">
          <h2 id="asm-faq-title">Antes de montar, tire suas dúvidas.</h2>
          <FaqList items={faq} name="faq-montagem" />
        </div>
      </section>

      <section className="asm-section asm-final" aria-labelledby="asm-final-title">
        <div className="asm-container asm-final-inner">
          <h2 id="asm-final-title">
            Vamos montar o seu <em>próximo PC?</em>
          </h2>
          <Actions />
          <p className="asm-perk asm-perk-final">
            <span>Comprando as peças com a Capucho, a mão de obra é gratuita.</span>
          </p>
          <Link className="asm-back asm-back-end" to="/gamer">
            <ArrowLeft size={17} />
            Voltar para a Área gamer
          </Link>
        </div>
      </section>
    </div>
  );
}
