import { Link } from "react-router";
import { InstagramLogo } from "@phosphor-icons/react";
import { business, maps, wa } from "../config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="footer-brand">
            CAPUCHO<span>Informática</span>
          </Link>
          <p>
            Seu computador pronto
            <br />
            pra acompanhar você.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/#servicos">Serviços</Link>
          <Link to="/#gamer">Área gamer</Link>
          <Link to="/#sobre">Sobre a Capucho</Link>
          <Link to="/#avaliacoes">Avaliações</Link>
        </div>
        <div>
          <h3>Fale com a gente</h3>
          <a href={wa()} target="_blank" rel="noreferrer">
            WhatsApp: {business.phone}
          </a>
          <a href={business.instagram} target="_blank" rel="noreferrer">
            <InstagramLogo size={19} />
            capucho_informatica
          </a>
          <a href={maps} target="_blank" rel="noreferrer">
            {business.street}
            <br />
            {business.district}, {business.city} - {business.state}
          </a>
        </div>
      </div>
      <div className="container footer-bottom" suppressHydrationWarning>
        © {new Date().getFullYear()} Capucho Informática. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
