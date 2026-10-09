import { Link } from "react-router";
import {
  AppWindow,
  ArrowUpRight,
  Circuitry,
  Monitor,
  Wrench,
} from "@phosphor-icons/react";
import { asset, photoSrcSet, wa } from "../config";

const productMessage =
  "Olá, Capucho! Quero consultar computadores, peças e acessórios disponíveis.";

// Serviços sem foto adequada mostram um ícone no lugar da imagem.
const icons = { AppWindow, Circuitry, Monitor, Wrench };

function CardBody({ image, photo, icon, title, description, cta }) {
  const Icon = icons[icon];
  return (
    <>
      <div className={photo ? "service-image is-photo" : "service-image"}>
        {image ? (
          <img
            src={asset(image)}
            srcSet={photoSrcSet(image)}
            sizes="(max-width: 767px) 80vw, (max-width: 1023px) 45vw, 380px"
            alt=""
            loading="lazy"
            width="1200"
            height="800"
          />
        ) : (
          Icon && <Icon className="service-icon" size={96} weight="duotone" aria-hidden="true" />
        )}
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

// "index" alterna entre os três tons de degradê do card.
export default function ServiceCard({ service, index = 0, products = false }) {
  const tone = `service-card tone-${index % 3}`;
  if (products)
    return (
      <a
        className={tone}
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
    <Link className={tone} to={`/servicos/${service.slug}`}>
      <CardBody
        image={service.image}
        photo={service.photo}
        icon={service.icon}
        title={service.title}
        description={service.description}
        cta="Conhecer o serviço"
      />
    </Link>
  );
}
