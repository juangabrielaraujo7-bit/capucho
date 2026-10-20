---
name: Capucho — Formatação e programas
description: Sistema local da superfície The Last of Us, isolado em .theme-formatting.
colors:
  charcoal: "#292e29"
  ivory: "#f2f1e9"
  olive: "#bfbd94"
  muted: "#dedfd5"
  line: "#a7aa8b50"
  ink: "#20261f"
  light-ground: "#e9e8dc"
  light-card: "#f6f4ebc4"
  olive-hover: "#d1cfaa"
typography:
  display:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(4.5rem, 7vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: ".005em"
  headline:
    fontFamily: "Bebas Neue, sans-serif"
    fontSize: "clamp(2.8rem, 4.5vw, 4.2rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: ".005em"
  title:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-.02em"
  hero-body:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "1.125rem"
    lineHeight: 1.55
  button:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 650
    lineHeight: 1.3
rounded:
  button: "3px"
  card: "4px"
spacing:
  action-gap: "14px"
  symptom-gap: "16px"
  service-gap: "18px"
  heading-gap: "32px"
components:
  button-primary:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.olive-hover}"
  button-outline:
    backgroundColor: "#272d2840"
    textColor: "{colors.ivory}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "13px 20px"
  symptom-card:
    backgroundColor: "#282e2852"
    rounded: "{rounded.card}"
    padding: "24px 18px 21px"
  service-card:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px 22px 20px"
---

# Design System: Capucho — Formatação e programas

## Overview

**Creative North Star: "Um novo começo"**

Esta superfície usa a composição The Last of Us fornecida pelo usuário: ambiente abandonado suave, Joel e Ellie em quatro poses e contraste entre carvão e marfim. A atmosfera contida apoia a explicação de um serviço real; backup, programas, licenças, orçamento e prazo são combinados antes do atendimento.

O registro descreve `src/pages/FormattingPage.jsx` e `src/formatting.css` em 20/10/2026, exclusivamente na rota `/gamer/formatacao-e-programas` e no tema `.theme-formatting`. A direção fornecida foi adotada e a revisão visual independente foi concluída com disposition: ship. A publicação foi autorizada expressamente pelo usuário.

**Key Characteristics:**

- Carvão e musgo cinza, oliva contido e marfim.
- Títulos condensados, corpo legível e ações retangulares.
- Personagens fornecidos, objetos transparentes e atmosfera periférica estática.
- Profundidade por fundos suaves, transparência e divisórias finas.

## Colors

A paleta mantém baixa saturação e alterna os ambientes escuros com uma seção de serviço clara.

### Primary

- **Oliva contido** (`olive`): ações principais e ênfases nos títulos escuros; `olive-hover` clareia o botão ao passar o ponteiro.

### Neutral

- **Carvão musgo** (`charcoal`): base do tema e navegação móvel.
- **Marfim** (`ivory`): títulos, marca e texto principal nos fundos escuros.
- **Marfim suave** (`muted`): texto secundário herdado pelo tema.
- **Linha vegetal translúcida** (`line`): contornos dos sintomas e divisórias das etapas.
- **Tinta musgo** (`ink`): texto nos botões e na seção clara.
- **Fundo marfim vegetal** (`light-ground`) e **card claro translúcido** (`light-card`): superfície de serviços e objetos.

As cores e opacidades de sobreposição dos fundos permanecem no CSS; não são uma segunda paleta global. Na seção clara, a ênfase usa `#626947` para manter contraste com o marfim.

## Typography

**Display Font:** Bebas Neue, sans-serif, peso 400, arquivo local via `@fontsource/bebas-neue/latin-400.css`, licença SIL OFL 1.1.

**Body Font:** DM Sans Variable, sans-serif, herdada da base existente.

Display e headline usam caixa alta, `text-wrap: balance` e traço de `.65px` na cor atual. O h1 tem três linhas explícitas; sua última linha usa `.88em` no desktop e `.8em` no celular. Não há uma escala matemática única: os tamanhos respondem ao papel de cada seção.

- **Display:** token `display`; até 700px, `clamp(3.7rem, 15vw, 5rem)`.
- **Headline:** token `headline`; até 700px, `clamp(2.3rem, 9.5vw, 3.25rem)`. Etapas usam `clamp(2.8rem, 4vw, 3.9rem)` no desktop; o CTA usa `clamp(2.8rem, 4.2vw, 3.8rem)` e `clamp(2.4rem, 10vw, 3.4rem)` no celular.
- **Title:** token `title`; sintomas usam `.9375rem` no desktop. Os títulos das etapas têm peso 450 e entrelinha 1.45.
- **Body:** parágrafos com entrelinha 1.55; abertura 1.125rem e largura máxima 45ch, reduzida a 1rem no celular. Descrições dos sintomas têm `.875rem`; serviços têm `.9375rem`.
- **Button:** token `button`; notas usam `.8125rem` ou `.875rem`, conforme o componente.

## Layout

O contêiner mede `min(1160px, calc(100% - 80px))`; até 1050px usa margens totais de 56px e até 700px de 40px. O header absoluto tem altura mínima de 88px, reduzida a 76px no celular.

O hero tem duas colunas `1.15fr / 1fr`, intervalo de 40px e altura mínima interna de 630px; texto e ações à esquerda, dupla de 420px à direita. No celular, vira uma coluna, prioriza texto e ações e reduz a dupla para 250px.

Sinais e etapas têm duas colunas `.75fr / 1.25fr`, personagem à esquerda atravessando as duas linhas, título e conteúdo à direita. As linhas são `auto 1fr`, com 32px abaixo do título, aproximando o conteúdo do cabeçalho. Os três sintomas ficam na mesma linha desktop, com intervalo de 16px; no celular, cada sintoma vira uma linha com ícone lateral.

Serviços usam colunas `1.55fr / 1fr`, quatro cards em 2 × 2 à esquerda e Joel de 360px à direita. Objetos ficam em áreas de 145px com `object-fit: contain`, sem fundo próprio. Até 700px Joel aparece antes dos cards; até 480px os cards ficam em uma coluna com objeto lateral. Etapas são uma lista de quatro linhas com divisórias; o CTA centralizado não tem personagens.

Espaçamento vertical desktop: sinais `64px 46px`, serviços `64px 48px`, etapas `60px 46px`, CTA `80px 88px`. Os valores menores e os breakpoints reais estão no CSS e no sidecar.

## Elevation & Depth

A página usa camadas tonais, imagens de ambiente já desfocadas e transparências; não define sombras de caixa para cards ou botões. Personagens recebem máscaras de integração na base. A folhagem fica nas extremidades externas, com largura `clamp(35px, 5.5vw, 88px)` no desktop e `5.5vw`, mínimo 20px, no celular. Névoa estática de seção: opacidade `.17`, reduzida a `.1` nos serviços; na base dos personagens, `.24`. Não há animação ambiental.

## Shapes

Botões retangulares com raio de 3px; cards com raio de 4px e borda de 1px. O marcador dos cards mede 30 × 3px no desktop. As etapas usam divisória inferior de 1px e linha vertical fina antes do texto. Os números condensados usam algarismos tabulares. A forma vem das imagens e das bordas discretas, sem molduras grandes para os personagens.

## Components

- **Ação principal:** oliva sobre tinta musgo, altura mínima 50px, intervalo interno 12px e transição de fundo `.18s ease`. No hero móvel, altura mínima 48px.
- **Ação secundária:** fundo `#272d2840`, borda `#e1e4d894`, texto marfim; hover `#272d2880`.
- **Navigation:** links DM Sans de `.9375rem`, sublinhado no hover; até 700px, menu controlado por botão de 44 × 44px com `aria-expanded` e `aria-controls`.
- **Symptom card:** ícone vetorial, título, descrição curta e marcador oliva; três colunas desktop, uma coluna móvel.
- **Service card:** objeto WebP transparente, título, descrição e marcador; a área de imagem contém o objeto sem cortá-lo.
- **Process row:** número Bebas Neue de 42px, altura mínima 75px e texto separado por borda vertical; no celular, número de 34px e altura mínima 72px.
- **Focus:** links e botões usam contorno de 2px na cor atual, deslocado 5px. Com movimento reduzido, transições e rolagem suave são removidas. Esta superfície não contém campos de formulário ou chips.

Os 18 WebP derivados têm origem e dimensões em `docs/formatting-assets.json`, com sidecars individuais em `public/assets/formatting/`. O hero carrega com prioridade alta; demais personagens e objetos usam carregamento tardio. As quatro poses fornecidas permanecem sem espelhamento.

## Do's and Don'ts

### Do:

- Do manter todos os ajustes desta superfície dentro de `.theme-formatting` e dos componentes `fm-`.
- Do preservar as quatro poses fornecidas e os objetos transparentes em cards claros.
- Do manter três sintomas na mesma linha desktop e etapas separadas por divisórias finas.
- Do manter a folhagem periférica e a névoa estática discreta.
- Do confirmar backup, sistema, programas, licenças, valores e prazo antes do serviço.

### Don't:

- Don't aplicar esta paleta ou tipografia às outras rotas sem autorização específica.
- Don't espelhar personagens, cortar rostos ou mãos ou inventar gestos.
- Don't introduzir uma estética futurista ou saturada nesta superfície.
- Don't inventar preços, prazos, licenças incluídas ou promessa de que formatar resolve qualquer problema.
- Publicar após a revisão, conforme autorização explícita do usuário.
