import { useState } from "react";
import { Link } from "react-router";
import { List, X } from "@phosphor-icons/react";
import WhatsAppButton from "./WhatsAppButton";
import { asset } from "../config";

const links = [
  ["Serviços", "servicos"],
  ["Área gamer", "gamer"],
  ["Avaliações", "avaliacoes"],
  ["Sobre a Capucho", "sobre"],
  ["Contato", "contato"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          to="/"
          className="brand"
          aria-label="Capucho Informática, página inicial"
        >
          <img
            src={asset("logo.webp")}
            alt="Capucho Informática"
            width="2048"
            height="698"
          />
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <List />}
        </button>
        <nav
          id="main-nav"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Navegação principal"
        >
          {links.map(([label, id]) => (
            <Link key={id} to={`/#${id}`} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <WhatsAppButton />
        </nav>
      </div>
    </header>
  );
}
