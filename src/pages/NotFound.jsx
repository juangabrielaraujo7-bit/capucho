import { Link } from "react-router";

export default function NotFound() {
  return (
    <section className="container section not-found">
      <h1>Página não encontrada.</h1>
      <p>Encontre o atendimento que você precisa na nossa página inicial.</p>
      <Link to="/" className="button button-primary">
        Voltar para o início
      </Link>
    </section>
  );
}
