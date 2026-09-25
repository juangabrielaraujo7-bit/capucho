# Materiais e revisão editorial

## Materiais conferidos

- `571400d0-9537-4b7f-bc5b-188af29fc699.png`: logo RGBA com transparência confirmada, usada no cabeçalho.
- `ba8c4e12-8e4e-4574-9642-f802d0a99c83.png`: segunda logo, com fundo claro, preservada na pasta original.
- `e690de25-3c7b-4c0e-9a62-67f3366bcd4d.png`: referência da paleta branca, azul-marinho e azul intenso.
- `Capucho_Hero_Fundo_Branco_Refinado.mp4`: vídeo de montagem da hero, agora em autoplay, loop e sem som conforme a revisão solicitada. O quadro estático permanece apenas como capa e alternativa caso o vídeo falhe.
- Os três vídeos verticais estão incluídos e abrem somente ao clicar, sem som. As capas são quadros dos próprios arquivos.
- Prints de avaliações: `f0722d99-357f-42c1-8bd1-7a77a0ad620f.png` (Naiwan), `3f6c8239-8697-417a-a423-9c5e56bcba46.png` (Bruno), `e3cba3f6-f923-4197-8715-83756fc6c655.png` (Sérgio). Foram transcritos trechos fiéis, com nome e atribuição ao Google. Mais texto fica em uma expansão para leitura.
- `85c2ae34-1e2b-4724-b488-f7f504eedc49.png`: imagem de fachada encontrada na pasta. O arquivo de fachada citado nominalmente no briefing não estava presente. A imagem disponível contém textos divergentes; endereço e telefone oficiais do briefing estão separados em texto no site.
- `upgrade.png` e `reparo.png`: ilustrações 3D geradas para o projeto. São imagens ilustrativas, não fotografias de serviços executados ou produtos em estoque.
- `formatacao.webp`, `limpeza-servico.webp`, `suporte.webp` e `produtos.webp`: novas ilustrações exclusivas por categoria. Os seis cards usam imagens distintas, sem o notebook com a marca Capucho.

## Revisão de ritmo e realismo

- Vídeo da hero acelerado em 1,65x (aproximadamente 4,9 segundos por ciclo), sem áudio, em 1280px, com início rápido de carregamento. O arquivo passou de aproximadamente 5,9 MB para 1,9 MB. O original permanece preservado.
- As seis categorias agora usam arquivos `*-foto.webp`, gerados com direção fotográfica: luz natural, materiais menos idealizados e equipamentos em bancada. São imagens ilustrativas geradas, não fotografias da loja, de serviços executados ou de produtos realmente em estoque.
- Os cards exibem as imagens com enquadramento fotográfico, preservando o fundo gelo e as superfícies brancas.

## Otimização de mídia (25/09/2026)

- Vídeos de serviço recodificados a partir dos originais em 540×960, 30 fps, sem áudio (tocam sem som) e com início rápido: de 41 MB para 14 MB no total. Os originais seguem na pasta do projeto.
- Removidos de `public/assets` os arquivos sem uso (`hero-montagem.mp4`, PNGs de `reparo`, `fachada`, `upgrade` e `logo`, e ilustrações antigas substituídas pelas versões `*-foto.webp`). A pasta passou de 56 MB para 17 MB.
- `og-image.jpg` (1200×630) criada a partir do quadro do notebook para a prévia de links no WhatsApp e redes sociais.
- Os dados estruturados usam os horários do briefing; ao confirmar ou mudar os horários, atualizar também `src/seo.js`.

## Confirmar antes de publicar

- Horários de funcionamento e condições de garantia de 90 dias.
- Nota Google 5,0 e 366 avaliações, datadas no briefing de 25/09/2026. O print do total não foi encontrado nesta pasta; o site identifica a data dos dados recebidos.
- Autorização/atribuição dos comentários e uso dos vídeos.
- Foto final da fachada, incluindo textos e contatos corretos.
- Procedimentos de backup e cuidado com dados, formas de pagamento e cobrança de visita. A versão atual orienta consultar a equipe, sem inventar condições.
- Fotos de equipe e interior e referência final para o estilo dos cartões de serviços.

## Escolhas desta etapa

DESIGN_VARIANCE: 5. MOTION_INTENSITY: 1. VISUAL_DENSITY: 3.

Tema claro fixo, com fundo gelo (#edf1f5) e cards brancos conforme revisão do usuário. Rodapé azul-marinho, grade de seis serviços em três colunas no desktop e repetição dos CTAs de WhatsApp preservam os requisitos do usuário, mesmo onde diferem dos padrões gerais da Taste. A única reprodução automática é o vídeo solicitado na hero. Não foram adicionados efeitos de interface, dark mode, página gamer, catálogo, preços ou captura de leads.
