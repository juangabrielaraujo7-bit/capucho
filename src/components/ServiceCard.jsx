import { Link } from "react-router";
import {
  ArrowUpRight,
  ArrowsClockwise,
  Cpu,
  Fan,
  Headset,
  ShoppingBag,
  Wrench,
} from "@phosphor-icons/react";
import { asset, photoSrcSet, wa } from "../config";

const productMessage =
  "Olá, Capucho! Quero consultar computadores, peças e acessórios disponíveis.";

const icons = {
  conserto: Wrench,
  "formatacao-e-programas": ArrowsClockwise,
  "upgrade-e-montagem": Cpu,
  "limpeza-preventiva": Fan,
  "suporte-e-atendimento": Headset,
  produtos: ShoppingBag,
};

function CardBody({ number, icon: Icon, image, title, description, cta }) {
  return (
    <>
      <div className="service-card-top">
        <span className="service-number">( {number} )</span>
        <Icon size={30} weight="light" />
      </div>
      <div className="service-image">
        <img
          src={asset(image)}
          srcSet={photoSrcSet(image)}
          sizes="(max-width: 767px) 80vw, (max-width: 1023px) 45vw, 380px"
          alt=""
          loading="lazy"
          width="1200"
          height="800"
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

export default function ServiceCard({ service, number, products = false }) {
  const tone = `service-card tone-${Number(number) % 3}`;
  if (products)
    return (
      <a
        className={tone}
        href={wa(productMessage)}
        target="_blank"
        rel="noreferrer"
      >
        <CardBody
          number={number}
          icon={icons.produtos}
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
        number={number}
        icon={icons[service.slug]}
        image={service.image}
        title={service.title}
        description={service.description}
        cta="Conhecer o serviço"
      />
    </Link>
  );
}
