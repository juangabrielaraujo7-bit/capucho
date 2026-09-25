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

O build fica em `dist/`. Para a verificação de navegação, com a prévia de desenvolvimento ativa e Google Chrome instalado:

```sh
node scripts/check-site.mjs
```

O arquivo `vercel.json` inclui fallback das páginas de serviços para `index.html`, permitindo abrir e atualizar os links diretamente na Vercel. Não há workflow de publicação no repositório. Se você conectar o repositório à Vercel, novos envios à branch configurada poderão disparar o deploy automático dessa integração.

## Organização

- `src/main.jsx`: estrutura, navegação, vídeos e componentes.
- `src/content.js`: textos dos serviços, perguntas frequentes e avaliações.
- `src/styles.css`: identidade visual e adaptação para celular.
- `public/assets/`: materiais usados na versão local.
- `docs/briefing.md`: briefing recebido.
- `docs/materiais-e-pendencias.md`: origem dos materiais e pontos para revisão.

O vídeo da hero inicia automaticamente em loop e sem som, com botão de pausa; respeita a preferência de redução de movimento do dispositivo. Os três vídeos de serviços continuam iniciando somente ao clicar. Não há efeitos de animação de interface ou formulário com coleta de dados. Links de WhatsApp apenas abrem a conversa com texto preparado; nenhuma mensagem é enviada automaticamente. O mapa usa um serviço externo e precisa de internet; endereço e link de rota continuam disponíveis quando ele não carrega.
