import { Link } from "react-router";
import { ArrowUpRight } from "@phosphor-icons/react";
import { asset, wa } from "../config";

const productMessage =
  "Olá, Capucho! Quero consultar computadores, peças e acessórios disponíveis.";

function CardBody({ image, title, description, cta }) {
  return (
    <>
      <div className="service-image">
        <img
          src={asset(image)}
          alt=""
          loading="lazy"
          width="1536"
          height="1024"
        />
      </div>
      <div className="service-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="text-link">
          {cta}
          <ArrowUpRight size={21} />
        </span>
      </div>
    </>
  );
}

export default function ServiceCard({ service, products = false }) {
  if (products)
    return (
      <a
        className="service-card"
        href={wa(productMessage)}
        target="_blank"
        rel="noreferrer"
      >
        <CardBody
          image="produtos-foto.webp"
          title="Computadores, peças e acessórios"
          description="Precisou de uma peça ou acessório? Consulte as opções com a gente."
          cta="Consultar produtos"
        />
      </a>
    );
  return (
    <Link className="service-card" to={`/servicos/${service.slug}`}>
      <CardBody
        image={service.image}
        title={service.title}
        description={service.description}
        cta="Conhecer o serviço"
      />
    </Link>
  );
}
