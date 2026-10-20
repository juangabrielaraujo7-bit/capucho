---
name: Capucho — Montagem Ragnarök
description: Sistema local da montagem completa, isolado no tema assembly.
colors:
  blood: "#a71925"
  blood-hover: "#86131e"
  blood-light: "#f18189"
  slate: "#25394b"
  ice: "#d4dee9"
  snow: "#e8edf4"
  ink: "#183449"
  muted-ink: "#3c5265"
  light-body: "#dce6f0"
  white: "#fff"
typography:
  display:
    fontFamily: "Cinzel Variable, Georgia, serif"
    fontSize: "clamp(2.2rem, 3.7vw, 3.35rem)"
    fontWeight: 650
    lineHeight: 1.17
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Cinzel Variable, Georgia, serif"
    fontSize: "clamp(1.9rem, 3vw, 2.65rem)"
    fontWeight: 650
    lineHeight: 1.17
    letterSpacing: "-.025em"
  title:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.02em"
  body:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: ".875rem"
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 650
    lineHeight: 1.3
rounded:
  action: "4px"
  card: "5px"
spacing:
  compact: "12px"
  item: "15px"
  card: "18px"
  action: "20px"
  group: "32px"
components:
  button-primary:
    backgroundColor: "{colors.blood}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.blood-hover}"
  button-ghost:
    backgroundColor: "#25394b33"
    textColor: "{colors.snow}"
    rounded: "{rounded.action}"
    padding: "14px 20px"
  goal-card:
    backgroundColor: "#f1f5fa80"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "23px"
  component-card:
    backgroundColor: "#203448b3"
    textColor: "{colors.snow}"
    rounded: "{rounded.card}"
    padding: "18px 16px"
---

# Design System: Capucho — Montagem Ragnarök

## Overview

**Creative North Star: "Ragnarök"**

Mundo visual aprovado para a rota existente `/gamer/montagem-completa`, em modo Persuade. Ardósia fria, gelo e marfim recebem recortes naturais de Kratos e Atreus; a composição usa fundos desfocados, névoa localizada e brasas estáticas. Títulos cerimoniais convivem com leitura direta e ações práticas.

Este documento descreve exclusivamente `.theme-assembly`, conforme `src/assembly.css` e `src/pages/AssemblyPage.jsx`. Não estabelece regras para o restante do site. A composição e a estratégia da superfície permanecem em `../assembly-direction.md`; as origens e dimensões dos assets estão em `../assembly-assets.json` (14 WebP novos e sete compartilhados). Documentação extraída do código. O parecer visual independente inicial aprovou as demais composições e pediu uma única correção localizada nas brasas. A correção foi aplicada e verificada no parecer final independente: disposition `ship`. A revisão reabriu goals-390, process-390 e parts-1440, confirmou brasas proporcionais e periféricas, com cartões, FAQ e centro limpos. Revisão encerrada, sem correções pendentes.

**Key Characteristics:**
- Alternância entre superfícies frias claras e escuras.
- Títulos Cinzel e leitura DM Sans.
- Vermelho sangue nas ações e ênfase clara sobre fundo escuro.
- Personagens naturais e atmosfera estática localizada.

## Colors

Paleta fria com uma família de acento vermelho; os valores normativos estão no frontmatter.

### Primary
- **Sangue:** ações principais, números das etapas, ornamentos claros e foco sobre fundo claro.
- **Sangue profundo:** hover das ações preenchidas.
- **Sangue claro:** ênfase de títulos sobre fundo escuro; o ornamento escuro usa o tom específico `#df7580`.

### Neutral
- **Ardósia:** base escura, menu móvel e rodapé.
- **Gelo:** base das superfícies claras.
- **Marfim frio:** títulos e ações secundárias sobre fundo escuro.
- **Tinta:** títulos e leitura forte sobre fundo claro.
- **Tinta suave:** parágrafos e notas sobre fundo claro.
- **Corpo claro:** parágrafos sobre fundo escuro.
- **Branco:** texto das ações preenchidas.

**The Contextual Accent Rule.** Use sangue para ações; a ênfase de títulos escuros usa sangue claro, conforme a implementação.

## Typography

**Display Font:** Cinzel Variable, com Georgia e serif como alternativas. Fonte local do pacote `@fontsource-variable/cinzel`, licença SIL OFL 1.1.

**Body Font:** DM Sans Variable, com sans-serif como alternativa.

Cinzel define os títulos principais em caixa alta, peso 650 e texto balanceado. DM Sans concentra corpo, navegação, botões e títulos dos cartões. Títulos das etapas usam Cinzel 700; números usam Cinzel 600 com algarismos tabulares.

- **Display:** escala fluida registrada no frontmatter; até 1050 px, `clamp(2rem,3.7vw,3rem)`; até 700 px, `clamp(1.55rem,7.4vw,2.5rem)`.
- **Headline:** escala base do frontmatter, com variações contextuais de objetivos, etapas e encerramento no CSS. Em telas estreitas, os títulos comuns usam `clamp(1.6rem,6.5vw,2.05rem)`.
- **Title:** título base do frontmatter; cartões de componente usam 1rem, reduzido para .9375rem até 700 px.
- **Body:** .875rem (14 px na base de 16 px) nos componentes e etapas, com entrelinha 1.55; objetivos e FAQ usam .9375rem em telas maiores e .875rem até 700 px.
- **Label:** botões usam a função do frontmatter; até 1050 px passam a .875rem. Notas e metadados variam de .75rem a .875rem; o breadcrumb móvel usa .6875rem.

## Layout

Container central de `min(1160px, calc(100% - 80px))`. Até 1050 px usa largura total menos 56 px; até 700 px, menos 40 px. Seções têm espaçamento vertical de 64/50 px, reduzido para 42/36 px até 700 px, com exceções explícitas no hero e encerramento.

Nesta superfície há cinco cenas escuro/claro/escuro/claro/escuro: apresentação; objetivos; componentes; etapas com FAQ; encerramento. A composição exata pertence ao contrato da superfície. No desktop, hero divide 1.45/1; objetivos usam .75/1.65; componentes 2.2/1; etapas .82/1.4. Objetivos têm quatro cartões em duas colunas; componentes, seis cartões em duas colunas. FAQ tem duas colunas ao fim da quarta cena.

Até 900 px o hero coloca texto e ações antes dos personagens e os componentes passam a uma composição vertical. Até 700 px, objetivos e etapas ficam verticais, o FAQ tem uma coluna e a navegação usa menu expansível. Até 480 px os cartões de objetivos e componentes usam uma coluna. Os personagens ficam compactos, sem espelhamento. Os breakpoints registrados são limites `max-width`, não larguras mínimas.

## Elevation & Depth

O CSS local não adiciona sombras de caixa: profundidade vem de recortes, fundos, transparências e camadas. Atmosfera tem camada 1, conteúdo camada 2 e cabeçalho camada 40. Gradientes azulados ajustam os fundos; máscaras suavizam a base dos personagens e localizam a névoa. Brasas preservam a proporção com `background-size: 100% auto`, ancoragem `center bottom` e máscara `linear-gradient(90deg, #000, transparent 6% 94%, #000)` para limitar a presença às bordas. Têm opacidade .2 no escuro e .15 no claro; até 700 px usam a versão menor com .17. Não há animação dos personagens ou da atmosfera.

**The Local Atmosphere Rule.** Névoa e brasas permanecem decorativas, sem capturar interação, e não substituem o contraste do texto. Brasas mantêm a proporção, ficam ancoradas na base e restritas às bordas pela máscara lateral.

## Shapes

Ações têm cantos discretos no raio action; cartões usam raio card. Bordas finas e parcialmente transparentes separam materiais sem contornos pesados. Ornamento vetorial linear tem largura 240 px, limitada a 60%, com altura 14 px; no celular, largura 190 px. Imagens de componentes usam `object-fit: contain` para preservar a forma inteira.

## Components

### Buttons

Ações diretas, de cantos discretos. Primário preenchido em sangue com borda `#bf4351`; hover usa sangue profundo também na borda. Secundário translúcido sobre fundo escuro tem borda `#ccd9e794`; hover usa fundo `#25394b99` e borda marfim frio. Altura mínima 50 px, reduzida para 48 px até 700 px; transições de cor e borda duram .18s com `ease`.

Foco visível tem contorno de 3 px e afastamento de 5 px; sangue sobre claro, `#f5d2d6` sobre seções escuras, cabeçalho e rodapé. A preferência por movimento reduzido remove transições.

### Cards / Containers

Objetivos usam superfície clara translúcida, borda `#728ba44a` e topo `#a719254d`. Componentes usam superfície escura translúcida, borda `#95acc142` e topo `#d1636e99`, com imagem ao lado da descrição no desktop. O corpo dos componentes é 14 px também no celular. Os seis arquivos de componentes são compartilhados com upgrade e permanecem ilustrativos, sem oferta de modelo específico.

### Navigation

Logo original `logo-400.webp`/`logo.webp`, em variante monocromática clara por `brightness(0) invert(1)`. Cabeçalho absoluto com altura mínima 90 px; navegação de 15 px, links com área mínima de 44 px e sublinhado no hover. Até 700 px, cabeçalho de 76 px, controles de 44 px e menu em coluna. O botão expõe `aria-expanded` e `aria-controls`; selecionar um link fecha o menu.

### Steps and FAQ

Etapas numeradas com divisores discretos, título Cinzel e texto DM Sans. FAQ reutiliza `FaqList`, com seis perguntas e `details`/`summary`: abertura exclusiva por nome, com fallback de fechamento das demais perguntas. Perguntas têm altura mínima de 62 px; hover usa sangue. Condições preservadas: peças próprias; ajuda na escolha; preço estimado e confirmação; prazo; gratuidade ao comprar as peças; Windows licenciado e programas instalados. O conteúdo comercial é verdade do produto, não token visual.

### Character and atmosphere

Quatro recortes naturais usam versões responsivas; Atreus é adolescente sem barba. A dupla do hero carrega com prioridade alta, demais personagens e componentes sob demanda. Preservam proporção e orientação, com saturação .86 e contraste .98. Fundos, brasas e névoa são decorativos; personagens têm descrições alternativas específicas.

## Do's and Don'ts

### Do:
- **Do** manter este sistema isolado na montagem completa.
- **Do** usar o logo original com a variante monocromática clara em CSS.
- **Do** preservar proporção e orientação naturais dos personagens, com Atreus adolescente sem barba.
- **Do** manter os seis componentes compartilhados e as seis condições do FAQ.
- **Do** preservar foco visível e a preferência por movimento reduzido.

### Don't:
- **Don't** propagar estes tokens para as outras páginas.
- **Don't** espelhar personagens, adulterar rostos ou animar os recortes.
- **Don't** apresentar componentes ilustrativos como oferta de modelos específicos.
- **Don't** reintroduzir estiramento ou presença central das brasas após a correção verificada.

Não canonizado: o estiramento e a presença central das brasas apontados no parecer inicial eram defeitos, corrigidos pela preservação da proporção e máscara lateral. A verificação independente da correção foi concluída com disposition `ship`; não há correções pendentes. Este parecer encerra a revisão visual e não afirma que a publicação já ocorreu.
