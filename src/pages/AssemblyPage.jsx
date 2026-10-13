import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Check, Info, WhatsappLogo } from "@phosphor-icons/react";
import FaqList from "../components/FaqList";
import { wa } from "../config";
import "../assembly.css";

// Página do serviço "Montagem completa" (card da área gamer), com a atmosfera gelada
// das referências de God of War Ragnarök. Cores e tipografia ficam isoladas em assembly.css.

const builderPath = "/gamer/monte-seu-pc";
const helpLink = wa(
  "Olá! Quero ajuda para montar meu PC gamer. Gostaria de conversar sobre os jogos que pretendo jogar e meu orçamento.",
);

const goals = [
  ["Seus jogos", "Os títulos que você quer rodar e como gosta de jogar."],
  ["Seu monitor", "Resolução e taxa de atualização da tela que você já tem ou pretende ter."],
  ["Outros usos", "Trabalho, estudo, edição ou transmissão ao vivo."],
  ["Seu orçamento", "Quanto pretende investir no conjunto."],
];

const parts = [
  ["Processador", "Executa as tarefas e participa do desempenho dos jogos; sua escolha precisa combinar com a placa-mãe e com o uso."],
  ["Placa de vídeo", "Tem papel importante nos gráficos; a escolha considera os jogos, a resolução e a qualidade desejada."],
  ["Memória RAM", "Dá espaço de trabalho para o sistema, jogos e programas abertos. Capacidade e padrão precisam ser compatíveis com a plataforma."],
  ["SSD", "Guarda sistema, jogos e arquivos e influencia os tempos de carregamento. O modelo precisa ser compatível com as conexões disponíveis."],
  ["Fonte", "Deve atender à configuração com potência, conectores e qualidade adequados."],
  ["Refrigeração e gabinete", "Precisam acomodar as peças e permitir uma circulação de ar adequada."],
];

const steps = [
  ["Você escolhe o caminho.", "Selecione as peças no montador ou conte pra gente o que quer jogar e quanto pretende investir."],
  ["A gente confere a configuração.", "Compatibilidade, disponibilidade, valor e prazo são alinhados pelo WhatsApp."],
  ["Você aprova o orçamento.", "A montagem começa depois da aprovação."],
  ["A Capucho monta e deixa pronto.", "O computador é montado, recebe o Windows licenciado e os programas e é testado antes da entrega."],
];

const care = [
  "Compatibilidade conferida",
  "Montagem das peças",
  "Windows licenciado e programas instalados",
  "Testes antes da entrega",
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

// Fala curta de um dos personagens: pergunta/resposta editorial da página, não citação do jogo.
function Voice({ who, children }) {
  return (
    <p className={`asm-voice asm-voice-${who === "Atreus" ? "atreus" : "kratos"}`}>
      <span className="asm-voice-who">{who}</span>
      <span className="asm-voice-line">{children}</span>
    </p>
  );
}

export default function AssemblyPage() {
  return (
    <div className="assembly-page">
      <section className="asm-hero">
        <div className="asm-container asm-hero-grid">
          <div className="asm-hero-copy">
            <Link className="asm-back" to="/gamer">
              <ArrowLeft size={17} />
              Área gamer
            </Link>
            <p className="asm-kicker">
              Capucho Gamer <span aria-hidden="true">/</span> Montagem completa
            </p>
            <h1>
              Seu próximo PC começa com as <em>escolhas certas.</em>
            </h1>
            <p className="asm-lead">
              Escolha suas peças ou conte com a Capucho para montar uma configuração para os seus
              jogos e seu orçamento.
            </p>
            <Actions />
            <p className="asm-perk">
              <span>Montagem grátis</span> comprando as peças com a Capucho.
            </p>
          </div>
          {/* Área reservada para a arte de Kratos e Atreus; por enquanto, só a atmosfera de gelo */}
          <div className="asm-hero-art" aria-hidden="true">
            <span className="asm-ice asm-ice-back" />
            <span className="asm-ice asm-ice-mid" />
            <span className="asm-ice asm-ice-front" />
            <span className="asm-blade" />
            <span className="asm-mist" />
          </div>
        </div>
      </section>

      <section className="asm-section asm-goals" aria-labelledby="asm-goals-title">
        <div className="asm-container asm-goals-grid">
          <div className="asm-goals-copy">
            <Voice who="Atreus">Por onde eu começo?</Voice>
            <h2 id="asm-goals-title">Que jornada você quer encarar?</h2>
            <p>
              Antes de escolher as peças, a gente entende o que você espera do seu PC: os jogos que
              quer rodar, o monitor que usa, se também vai trabalhar ou transmitir e quanto pretende
              investir.
            </p>
            <p className="asm-strong">
              Você não precisa conhecer cada componente. A Capucho ajuda a transformar essas
              respostas em uma configuração.
            </p>
          </div>
          <ul className="asm-goal-list">
            {goals.map(([title, text], i) => (
              <li key={title}>
                <span className="asm-goal-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="asm-section asm-parts" aria-labelledby="asm-parts-title">
        <div className="asm-container">
          <div className="asm-parts-head">
            <h2 id="asm-parts-title">
              Força sozinha <em>não resolve.</em>
            </h2>
            <p>
              Um bom PC funciona como um conjunto. A escolha precisa considerar compatibilidade,
              alimentação, refrigeração e o que você realmente pretende fazer com ele.
            </p>
          </div>
          <dl className="asm-part-list">
            {parts.map(([name, text]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <p className="asm-parts-close">
            A Capucho ajuda a escolher onde faz sentido investir e o que precisa funcionar junto.
          </p>
        </div>
      </section>

      <section className="asm-section asm-process" aria-labelledby="asm-process-title">
        <div className="asm-container">
          <div className="asm-process-head">
            <h2 id="asm-process-title">Um plano claro antes de começar.</h2>
            <Voice who="Kratos">Primeiro, o plano. Depois, a montagem.</Voice>
          </div>
          <ol className="asm-steps">
            {steps.map(([title, text], i) => (
              <li key={title}>
                <span className="asm-step-number" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="asm-note">
            <Info size={20} aria-hidden="true" />
            <span>
              O total exibido no montador é estimado. O orçamento final, a disponibilidade das peças
              e o prazo são confirmados pelo WhatsApp.
            </span>
          </p>
        </div>
      </section>

      <section className="asm-section asm-care" aria-labelledby="asm-care-title">
        <div className="asm-container asm-care-grid">
          <h2 id="asm-care-title">A montagem termina quando o conjunto está pronto.</h2>
          <div className="asm-care-body">
            <p>
              Da conferência das peças à montagem, à instalação do Windows e dos programas e aos testes, a
              Capucho acompanha a configuração como um conjunto, e o PC sai da loja pronto para
              usar. Se você já comprou os componentes, também podemos avaliar a compatibilidade e
              as condições deles para realizar a montagem.
            </p>
            <ul className="asm-care-list">
              {care.map((item) => (
                <li key={item}>
                  <Check size={18} weight="bold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
          <p>
            Comece pelas peças ou conte pra gente o que você quer jogar e quanto pretende investir.
            Comprando as peças com a Capucho, a montagem é gratuita.
          </p>
          <Actions />
          <Link className="asm-back asm-back-end" to="/gamer">
            <ArrowLeft size={17} />
            Voltar para a Área gamer
          </Link>
        </div>
      </section>
    </div>
  );
}
