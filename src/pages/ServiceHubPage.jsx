import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import WhatsAppButton from "../components/WhatsAppButton";
import { services } from "../content";

// Endereços antigos que agrupavam vários serviços (/servicos/conserto etc.): uma lista curta
// que leva às páginas específicas, para quem chega por links ou buscas antigas.
export default function ServiceHubPage({ hub }) {
  const items = hub.links.map((slug) => services.find((s) => s.slug === slug)).filter(Boolean);
  return (
    <section className="service-hero container hub-page">
      <Link className="back-link" to="/#servicos">
        <ArrowLeft />
        Todos os serviços
      </Link>
      <p className="eyebrow">Serviços</p>
      <h1>{hub.title}</h1>
      <p className="hero-description">{hub.intro}</p>
      <ul className="hub-list">
        {items.map((s) => (
          <li key={s.slug}>
            <Link to={`/servicos/${s.slug}`}>
              <span>
                <strong>{s.title}</strong>
                <span>{s.description}</span>
              </span>
              <ArrowUpRight size={22} />
            </Link>
          </li>
        ))}
        {hub.gamer && (
          <li>
            <Link to="/gamer">
              <span>
                <strong>Montagem de PC gamer</strong>
                <span>Área gamer com o montador de PC e os computadores montados pela Capucho.</span>
              </span>
              <ArrowUpRight size={22} />
            </Link>
          </li>
        )}
      </ul>
      <WhatsAppButton message={hub.message} />
    </section>
  );
}
