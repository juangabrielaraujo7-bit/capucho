---
name: Capucho — Limpeza e pasta térmica
description: Sistema local da rota gamer de limpeza, isolado em .theme-cleaning.
colors:
  terra: "#a94732"
  terra-clara: "#d87962"
  carvao: "#211f1a"
  pergaminho: "#f1e3c3"
  texto-suave: "#e1d1b4"
typography:
  display:
    fontFamily: "Alfa Slab One, Georgia, serif"
    fontSize: "clamp(2.2rem, 4vw, 3.35rem)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Alfa Slab One, Georgia, serif"
    fontSize: "clamp(1.9rem, 3vw, 2.65rem)"
    fontWeight: 400
    lineHeight: 1.13
    letterSpacing: "-.035em"
  title:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 750
    lineHeight: 1.25
    letterSpacing: "-.02em"
  label:
    fontFamily: "DM Sans Variable, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  action: "3px"
  panel: "4px"
spacing:
  compact: "12px"
  regular: "18px"
  section-title: "28px"
components:
  button-primary:
    backgroundColor: "{colors.carvao}"
    textColor: "#fff0d0"
    rounded: "{rounded.action}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "#342e24"
  button-outline:
    backgroundColor: "#65302730"
    textColor: "#fff2d3"
    rounded: "{rounded.action}"
    padding: "13px 20px"
  symptom:
    backgroundColor: "{colors.pergaminho}"
    textColor: "#28251e"
    rounded: "{rounded.panel}"
    padding: "22px 26px"
  care-card:
    backgroundColor: "#25231f"
    textColor: "#f5e8cb"
    rounded: "{rounded.panel}"
  process-row:
    backgroundColor: "#211f1acc"
    rounded: "{rounded.panel}"
    padding: "14px 20px"
---

# Design System: Capucho — Limpeza e pasta térmica

## Overview

**Creative North Star: "Cuidar antes da próxima jornada"**

Western suave em terra, carvão e pergaminho. Cenários discretos e Arthur Morgan em escala moderada enquadram o atendimento; os textos e as ações permanecem centrais.

Este documento vale somente para `/gamer/limpeza-e-pasta-termica`, em `.theme-cleaning`. A autoridade humana é a prévia `../../public/area gamer/pagina red dead/255843c2-0272-4754-aeeb-04971d1e3eb7.png` (763 × 2061); a direção está em `../cleaning-direction.md`. Os demais temas mantêm seus próprios sistemas.

**Key Characteristics:**
- Cinco cenas com transições suaves.
- Tipografia slab western e corpo legível.
- Personagens moderados e poeira estática.
- Ações retangulares e painéis sóbrios.

## Colors

### Primary

Terra marca palavras de destaque; terra clara conserva a leitura nas cenas escuras.

### Neutral

Carvão sustenta navegação, ações e cenas escuras. Pergaminho ilumina os sinais e a cena de cuidados. Texto suave serve aos avisos secundários.

**The Contexto Local Rule.** Aplicar esta paleta somente à superfície de limpeza.

## Typography

Alfa Slab One, peso 400, usa licença SIL OFL 1.1 e fallback Georgia/serif; DM Sans Variable serve ao corpo, rótulos e títulos de item. Os tokens registram a escala principal; parágrafos usam entrelinha (1.6).

O título abre em três linhas, com a palavra final ampliada (1.65em; 1.7em no celular). Títulos de cena são maiúsculos, com textura mínima por máscara. No celular, display usa `clamp(1.68rem, 6.75vw, 2.7rem)`; títulos usam `clamp(1.6rem, 6.1vw, 2.4rem)`.

**The Duas Vozes Rule.** Reservar a slab aos títulos, marca e números das etapas; usar DM Sans nas explicações e ações.

## Layout

Contêiner central de até (1160px), com (80px) totais de margem; abaixo de (1050px), (56px); abaixo de (700px), (40px). Hero em duas colunas (1.55fr / 1fr), sinais e etapas com figura à esquerda, cuidados em grade (2 × 2) e figura à direita. A sequência é pôr do sol → vila → pergaminho → vila → pôr do sol.

Até (700px), texto, ações e figura empilham; o menu recolhe e mantém alvos de (44px). Arthur mede (380px) no hero desktop e (220px) no celular; figuras seguintes ficam próximas de (180–185px) no celular. Até (480px), os cuidados tornam-se linhas, imagem à esquerda (35%). Cabeçalho mede (88px), ou (76px) no celular.

## Elevation & Depth

A profundidade vem de sobreposições tonais, cenário, máscaras e filtros leves; os componentes não usam sombras elevadas. Poeira permanece estática, sem bordas aparentes. A correção móvel usa tamanho de fundo (100% auto) e máscaras horizontais e verticais intersectadas nas transições; seu veredito visual é registrado pela revisão, não por este documento.

## Shapes

Ações quase retas e painéis discretamente arredondados seguem os tokens. Contornos finos (1px) separam ação e conteúdo. As figuras desaparecem suavemente na base por máscara.

## Components

Botão primário escuro, secundário translúcido com contorno; ambos têm altura mínima (50px), ou (48px) nas ações móveis. Hover muda cor em (.18s ease). Links e botões recebem foco visível com contorno (2px), afastado (5px). Movimento reduzido remove transições.

Sinais são três linhas claras com ícones e texto; cuidados são quatro cartões escuros com foto e aviso de imagem ilustrativa. Etapas são quatro linhas numeradas, com fundo escuro translúcido. A navegação oferece âncoras para cuidados e etapas, retorno à área gamer e WhatsApp.

**The Imagem Rastreável Rule.** Cada raster publicado deve manter origem e dimensões no manifesto `../cleaning-assets.json`.

O manifesto lista os 21 WebP derivados dos arquivos fornecidos na pasta `public/area gamer/pagina red dead/`; a procedência fornecida não equivale a licença adicional. São três poses: hero, sinais e cuidados. A pose dos sinais é reutilizada nas etapas, sem espelhamento.

Hero usa imagem (720 × 1080) ou (420 × 630), carregamento eager, prioridade alta e decodificação assíncrona. As demais figuras usam (620 × 930) ou (360 × 540), lazy e decodificação assíncrona. Todas declaram largura e altura, `srcset` e `sizes`. Fotos ilustrativas usam (600 × 450) e (360 × 270), lazy; o corte visível é controlado pelo layout.

Cenários em CSS usam (1672 × 941) no desktop e (900 × 507) até (700px); não possuem atributo lazy. A poeira é (1200 × 675). O manifesto registra bytes, dimensões e nome de cada original. Os caminhos de exibição estão em `/assets/cleaning/`.

## Do's and Don'ts

### Do:
- **Do** preservar a sequência das cinco cenas e o foco nas ações.
- **Do** manter Arthur moderado, sem espelhamento, e poeira estática.
- **Do** declarar dimensões e manter a origem dos rasters no manifesto.

### Don't:
- **Don't** aplicar este sistema às demais rotas.
- **Don't** converter a direção aprovada em roxo gamer ou grunge pesado.
- **Don't** tratar as imagens ilustrativas como fotografias de serviços reais.

