# Upgrade de peças — direção e limites da implementação

- Rota: `/gamer/upgrade-de-pecas`.
- Objetivo: explicar as possibilidades de upgrade e iniciar uma conversa de orçamento pelo WhatsApp real da Capucho.
- Referência aprovada fornecida pelo usuário: `public/area gamer/pagina resident evil/aa7d85a9-4d44-4821-af24-df6539216732.png` (751 × 2095).
- Os arquivos chegaram soltos na pasta acima. Não havia `LEIA-ME.txt` nem a estrutura de pacote originalmente mencionada; isso foi informado ao usuário. O prompt anexado e a imagem são a autoridade visual.
- Cinco seções: hero com Leon de jaqueta; sinais com Ada apresentando; seis componentes com Leon tático; etapas com a segunda Ada de braços cruzados; CTA final.
- Hierarquia e copy conforme o prompt. Textos, títulos, navegação, botões e cards são HTML/CSS; a referência não é usada como página ou recortada para obter personagens.
- Personagens em escala moderada, desaturação leve, floresta já desfocada, névoa transparente diante da base dos personagens. Nada de vídeo, 3D, roxo, neon ou blur pesado em CSS.
- Fonte dos títulos: Bebas Neue, distribuída por `@fontsource/bebas-neue`, licença SIL OFL 1.1. Corpo: DM Sans já usado no projeto.
- Paleta: fundo `#060d11`, texto marfim `#eaeae4`, texto secundário `#c0c6c8`, vermelho `#eb0927`, bordas azul-acinzentadas discretas.
- Assets otimizados e suas origens constam em `upgrade-assets.json`. Personagens mantêm as proporções; somente margens transparentes dos componentes foram removidas antes da conversão.
- A imagem principal tem prioridade alta; as demais usam lazy loading, dimensões e variantes responsivas. A névoa é estática.
- O tema é isolado em `.theme-upgrade`, sem mudar a montagem completa de Kratos/Atreus, o montador ou o site principal.
- Header e rodapé próprios desta rota seguem a referência e usam os dados reais de `src/config.js`.
- Publicação autorizada pelo usuário após a revisão local; manter deploy automático nas próximas alterações, salvo orientação contrária.

## Conferência prevista

Comparar desktop e celular com a referência, verificar proporções e atmosfera, as seis imagens dos componentes, quatro personagens, menu móvel, âncoras, mensagens de WhatsApp, contraste, carregamento e ausência de rolagem horizontal. Preservar as outras rotas.

