# Validação — serviços de /gamer

## Escopo e direção preservada

Refinamento local da seção “O que fazemos no seu PC gamer”, conforme `direction.md` e `PRODUCT.md`. O mundo gamer existente foi preservado; esta documentação registra a implementação e a comparação, sem aprovar uma identidade nova. Não houve atualização de `DESIGN.md`, sidecar ou sistemas visuais das demais páginas.

A seção anterior de cards de texto e ícones foi substituída por quatro cards ilustrados, mantendo os serviços e seus destinos. O diff de `src/styles.css` remove apenas as regras anteriores desses cards e seus ajustes responsivos; as regras atuais ficam em `src/gamer-services.css`. A comparação de SSR confirmou preservação exata do conteúdo fora da seção. As páginas de destino permanecem preservadas.

## Valores implementados

- Fundo da seção: `#0d0918`, com iluminação radial discreta `#25133e33`; base dos cards `#100b1b`.
- Títulos: `#f8f5ff`; descrições: `#b8aecf`; rótulo: `#b57bff`; links e borda de hover: `#bd86f5`; borda normal: `#7c49ad`; foco: `#d5b0ff`.
- Traços: vermelho `#bc2436` nos dois primeiros serviços, ocre `#c49340` na limpeza e oliva `#7b8d43` na formatação.
- Cards com raio de 16px, conteúdo com 24px de padding lateral e inferior, arte quadrada e fade CSS restrito aos 28% inferiores da imagem. Sem filtro nas artes.
- Grid de quatro colunas, duas até 1023px e uma até 599px; intervalos de 20px e 24px no celular. Títulos desktop reservam duas linhas e os links inferiores ficam alinhados por linha do grid.
- Montserrat Variable existente nos títulos, peso 800; descrições de 1rem com entrelinha 1.6. O detector sinalizou uma vez `overused-font`; a exceção estreita está documentada junto à declaração CSS para preservar a fonte existente conforme pedido do usuário.
- Hover de -3px com transição de 0.2s; movimento e transição desativados com preferência de movimento reduzido. Foco visível de 3px com afastamento de 5px.

## Artes e proveniência

O pedido citava a pasta `cards-servicos-gamer`; os arquivos efetivamente recebidos estão em `public/area gamer/cards area gamer/`, com nomes UUID. A referência é `6d08a363-df83-41e5-a66d-7443e7af2fcb.png`. `assets.json` mapeia os quatro PNG originais para oito WebP responsivos de 400px e 720px, qualidade 90. Os PNG originais foram preservados; a transformação foi somente redimensionamento proporcional e codificação, sem retoque, espelhamento ou alteração de cor. Conferência de proveniência: oito derivados, zero arquivos ausentes.

As imagens têm dimensões declaradas, `srcSet`, `sizes`, carregamento adiado e decodificação assíncrona. O enquadramento individual mantém faces e chapéu; o fade, as cores das artes, os traços e a paleta foram aprovados na comparação visual com a referência. Não foram acrescentados nomes ou logos de jogos, vídeo ou biblioteca.

## Evidências e resultado

A revisão independente comparou a referência e sete capturas finais. Veredito: **pronto para publicar**, sem correção pendente. As quatro artes e os enquadramentos foram aprovados, assim como a hierarquia, o alinhamento dos textos e links e a resposta em 4/2/1 colunas.

Os resultados registrados em `.qa/gamer-services-checks.json` cobrem larguras de 360, 390, 768 e 1440px: sem overflow horizontal, conteúdo cortado, erros ou recursos ausentes. Confirmam fonte e cores calculadas, ausência de filtros, enquadramentos individuais e preservação fora da seção. Textos e destinos foram conferidos: montagem completa, upgrade de peças, limpeza e pasta térmica e formatação e programas levam às respectivas rotas `/gamer/…`.

Cada card é um único link, nomeado pelo título, com imagem decorativa e indicador visual de destino. Tab, Enter e navegação real até a montagem completa foram verificados; os quatro endereços e seus arquivos de destino pré-renderizados foram conferidos. Hover de -3px, preferência de movimento reduzido, dimensões de imagem e carregamento adiado também foram conferidos.

Build concluído com 18 rotas e página 404. Permanece apenas o aviso preexistente de tamanho de chunk, sem falha de build. A revisão autoriza o início do deploy; este registro não afirma que a publicação já ocorreu.
