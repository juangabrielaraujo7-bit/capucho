---
name: Capucho — Upgrade Resident Evil
description: Sistema exclusivo da rota /gamer/upgrade-de-pecas, isolado em .theme-upgrade.
colors:
  background: "#060d11"
  ink: "#eaeae4"
  muted: "#c0c6c8"
  red: "#eb0927"
  red-hover: "#bf071f"
  border: "rgba(169, 188, 198, .3)"
  panel: "#050d12b8"
  white: "#fff"
typography:
  display:
    fontFamily: '"Bebas Neue", sans-serif'
    fontSize: "clamp(4.5rem, 7vw, 6.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: ".008em"
  headline:
    fontFamily: '"Bebas Neue", sans-serif'
    fontSize: "clamp(2.75rem, 4.5vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: ".008em"
  title:
    fontFamily: '"DM Sans Variable", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-.02em"
  body:
    fontFamily: '"DM Sans Variable", sans-serif'
    fontSize: "1rem"
    lineHeight: 1.55
  button:
    fontFamily: '"DM Sans Variable", sans-serif'
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.25
rounded:
  button: "3px"
  panel: "4px"
spacing:
  compact: "12px"
  regular: "18px"
  roomy: "24px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
  button-outline:
    backgroundColor: "#02070a33"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "15px 24px"
  part-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "14px 20px 20px"
---

# Design System: Capucho — Upgrade Resident Evil

## Overview

**Creative North Star: "Floresta fria, reforço preciso"**

Atmosfera cinematográfica de Resident Evil: floresta fria, personagens de escala moderada e informação clara sobre upgrade. Este documento descreve somente `/gamer/upgrade-de-pecas`; a implementação vive em `.theme-upgrade`. O tema principal claro, o gamer roxo e a montagem completa azul permanecem mundos independentes.

A composição aprovada é `public/area gamer/pagina resident evil/aa7d85a9-4d44-4821-af24-df6539216732.png`. A origem de cada asset otimizado consta em `../upgrade-assets.json`; o contrato da superfície está em `../upgrade-direction.md`. A referência orienta a composição; títulos, textos, navegação, cards e CTAs são HTML/CSS.

**Key Characteristics:**
- Floresta já desfocada e névoa transparente estática fornecidas pelo usuário.
- Marfim legível, vermelho pontual e painéis escuros discretos.
- Títulos condensados com desgaste fino em CSS; corpo limpo.

## Colors

A paleta combina fundo azul quase preto com marfim e um acento vermelho de ação.

### Primary
- **Vermelho de reforço** (`red`): CTAs, palavras destacadas, numeração e pequenos traços; `red-hover` responde ao ponteiro.

### Neutral
- **Floresta noturna** (`background`): base e continuidade entre seções.
- **Marfim** (`ink`) e **cinza frio** (`muted`): títulos e texto de apoio, respectivamente.
- **Painel translúcido** (`panel`) e **borda fria** (`border`): cards sobre a floresta.
- **Branco** (`white`): texto dos botões vermelhos.

**The Acento Preciso Rule.** O vermelho destaca ação e palavras-chave; os painéis permanecem escuros.

## Typography

**Display Font:** Bebas Neue, fallback sans-serif; peso regular, distribuída por `@fontsource/bebas-neue`, licença SIL OFL 1.1.
**Body Font:** DM Sans Variable, fallback sans-serif, já presente no projeto.

A tipografia condensada sustenta os títulos em caixa alta. A leitura de conteúdo e de controles usa DM Sans. Os papéis e valores-base estão no frontmatter.

- **Display:** hero; até 1100px usa `clamp(4rem, 7.3vw, 5.5rem)` e até 700px `clamp(3.5rem, 14.5vw, 5rem)`.
- **Headline:** seções; no celular, base `clamp(2.25rem, 9vw, 3rem)`. Sinais, processo e encerramento têm ajustes locais no CSS.
- **Title:** títulos de cards; sinais usam 1.25rem no desktop, etapas 1rem com peso 550.
- **Body:** no celular, base .9375rem; textos de componentes .8125rem/1.4. Textos de sinais limitam-se a 28ch.
- **Desgaste:** títulos h1/h2 usam máscara SVG repetida de 91 × 87px, em luminância, e traço de .25px. O efeito preserva texto selecionável e acessível.

**The Texto Vivo Rule.** Desgaste é tratamento CSS do título; não substituir conteúdo por imagens.

## Layout

Container central de até 1160px, com largura `calc(100% - 80px)`; até 700px, `calc(100% - 40px)`. As seções alternam conteúdo e personagens em duas colunas; os seis componentes usam grade própria de duas colunas. Espaçamentos frequentes de 12, 18 e 24px articulam controles e cards; seções têm respiros de aproximadamente 56–76px no desktop.

Até 1100px, gaps e proporções diminuem. Até 700px, as seções passam a uma coluna; a grade de peças continua com duas. O processo coloca título antes de Ada e das etapas. Navegação vira menu acionado por botão de 44 × 44px com `aria-expanded` e `aria-controls`; os links fecham o menu.

Os quatro personagens preservam proporção e `object-fit: contain`: Leon de jaqueta (360px; celular 240px), Ada dos sinais (310px; 195px), Leon tático (360px, 320px até 1100px; 220px no celular) e Ada das etapas (310px; 190px). Não ampliar para dominar a leitura. Hero carrega com prioridade alta; demais personagens e peças usam lazy loading e dimensões declaradas.

## Elevation & Depth

Não há sombras de caixa. Profundidade vem da floresta já desfocada, gradientes escuros, painéis translúcidos e sobreposição de névoa estática na base. Personagens usam `saturate(.78) brightness(.9)` e máscara vertical que desaparece ao final. A névoa de seção tem opacidade .28 (celular .2); na base dos personagens, .9. Não há animação ambiental nem blur pesado em CSS.

## Shapes

Botões têm cantos discretos; painéis ligeiramente mais suaves, conforme os raios do frontmatter. Bordas de 1px delimitam superfícies. Cards de sinais e etapas recebem pequena ponta lateral com quadrado de 12px rotacionado, removida no celular. Traços vermelhos curtos reforçam peças, ícones e números.

## Components

### Buttons

Links de ação com ícone SVG e texto, alinhados por flex. Primário vermelho para WhatsApp; contornado para âncora de possibilidades. Altura mínima de 54px; no celular 48px, padding 13px 17px e fonte .875rem. Hover do contornado clareia fundo e borda. Foco visível de links e botões: contorno 2px `#f7f3e9`, afastado 5px. Transições de fundo/borda de .18s, desativadas com preferência por movimento reduzido.

### Cards / Containers

Peças: painel translúcido, borda fria, imagem contida em área de 120px (85px no celular), título e descrição HTML. Sinais: lista com ícone SVG, título e texto. Etapas: lista ordenada com número em Bebas Neue e traço vermelho; sem interação de card nem sombra de hover inventada.

### Navigation

Header absoluto com marca textual, links DM Sans de .9375rem/600 e contato WhatsApp contornado. Link atual e hover recebem sublinhado vermelho de 2px, transição .18s ease. No celular, menu vertical sobre fundo `#071116fa`; o contato conserva ícone e nome acessível. Rodapé centralizado apresenta os dados reais de `src/config.js`.

## Do's and Don'ts

### Do:
- **Do** restringir este sistema à rota e ao tema de upgrade.
- **Do** usar os quatro personagens e assets fornecidos, preservando proporções e escala moderada.
- **Do** manter títulos, cards, navegação e CTAs em HTML/CSS e os dados de contato em `src/config.js`.
- **Do** preservar a floresta já desfocada, a névoa estática e as variantes responsivas existentes.

### Don't:
- **Don't** propagar este tema para as páginas principal, gamer, montador ou montagem completa.
- **Don't** acrescentar neon, roxo, vídeo, 3D, animação de névoa ou blur pesado nesta superfície.
- **Don't** usar a referência como página rasterizada ou recortá-la para obter personagens.

