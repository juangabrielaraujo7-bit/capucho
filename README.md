# Capucho Informática

Primeira versão da home e de cinco páginas de serviços. Projeto local em React + Vite, com CSS próprio, fontes Sora e DM Sans hospedadas junto do site e ícones Phosphor. Direção visual orientada apenas pela skill design-taste-frontend e pelo briefing fornecido.

## Abrir a prévia

Instale o Node.js 22.19 ou posterior. Abra um terminal nesta pasta e execute:

```sh
npm ci
npm run dev
```

Abra **http://127.0.0.1:5173** no navegador. Para encerrar a prévia, pressione Ctrl+C no terminal. Nas próximas vezes, basta executar `npm run dev`.

No Windows, também pode abrir `ABRIR-PREVIA.cmd` com dois cliques, após instalar as dependências.

## Páginas

- `/`: home
- `/servicos/conserto`
- `/servicos/formatacao-e-programas`
- `/servicos/upgrade-e-montagem`
- `/servicos/limpeza-preventiva`
- `/servicos/suporte-e-atendimento`

O cartão de produtos abre uma consulta no WhatsApp. A navegação gamer leva à seção da home; a página gamer completa permanece fora desta etapa.

## Verificar

```sh
npm run build
npm run preview
```

O build fica em `dist/`. O `npm run build` faz três etapas: build do navegador, build de servidor (`src/entry-server.jsx`) e `scripts/prerender.mjs`, que gera o HTML completo de cada página (`index.html`, `servicos/*.html`, `404.html`) com título, descrição, link canônico, prévia de compartilhamento (Open Graph), dados estruturados de negócio local, `sitemap.xml` e `robots.txt`. No navegador, o React assume a página já renderizada (hidratação).

**Domínio:** enquanto não houver domínio próprio, o build usa o domínio de produção da Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) ou, localmente, `http://127.0.0.1:4173`. Quando o domínio existir, defina a variável de ambiente `SITE_URL` (ex.: `https://www.seudominio.com.br`) na Vercel.

Para a verificação de navegação, com a prévia ativa e Google Chrome instalado:

```sh
node scripts/check-site.mjs
```

Use `PREVIEW_URL=http://127.0.0.1:4173` para verificar o build de produção.

O `vercel.json` usa `cleanUrls`, então `/servicos/conserto` serve `servicos/conserto.html`; endereços inexistentes recebem `404.html`. Não há workflow de publicação no repositório. Se você conectar o repositório à Vercel, novos envios à branch configurada poderão disparar o deploy automático dessa integração.

## Organização

- `src/main.jsx`: entrada do navegador (React Router + hidratação).
- `src/entry-server.jsx`: entrada usada no pré-render.
- `src/App.jsx`: layout e rotas.
- `src/pages/`: `Home`, `ServicePage` e `NotFound`.
- `src/components/`: cabeçalho, rodapé, cards, vídeos e botões.
- `src/config.js`: dados do negócio, WhatsApp, endereço e mapas (alterar aqui).
- `src/seo.js`: títulos, descrições e dados estruturados por página.
- `src/content.js`: textos dos serviços, perguntas frequentes e avaliações.
- `src/styles.css`: identidade visual e adaptação para celular.
- `public/assets/`: materiais usados na versão local.
- `docs/briefing.md`: briefing recebido.
- `docs/materiais-e-pendencias.md`: origem dos materiais e pontos para revisão.

O vídeo da hero inicia automaticamente em loop e sem som, com botão de pausa; respeita a preferência de redução de movimento do dispositivo. Os três vídeos de serviços continuam iniciando somente ao clicar. A única animação de interface é a rolagem contínua dos depoimentos (`src/components/TestimonialsColumns.jsx`, adaptado do componente testimonials-columns-1 sem Tailwind nem `motion`): pausa ao passar o mouse, tem botão de pausa e fica estática com redução de movimento. Não há formulário com coleta de dados. Links de WhatsApp apenas abrem a conversa com texto preparado; nenhuma mensagem é enviada automaticamente. O mapa usa um serviço externo e precisa de internet; endereço e link de rota continuam disponíveis quando ele não carrega.
