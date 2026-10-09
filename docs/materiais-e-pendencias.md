# Materiais e revisão editorial

## Imagens dos serviços: equipamentos recortados

As seis imagens dos serviços possuem fundo transparente, sem ambientes, bancadas, plantas ou móveis. Os cards e as aberturas das páginas aplicam uma sombra suave ao contorno dos equipamentos para sugerir flutuação. As versões responsivas de 480, 800 e 1200 pixels preservam o canal alfa. São imagens ilustrativas geradas, não registros de trabalhos ou produtos em estoque.

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
- Fotos `*-foto.webp` com versões de 480 e 800 px (`srcset`), logo em 400 px e vídeo da hero em 720 px (264 KB) para celulares. Ao trocar uma foto, gerar também as versões `-480` e `-800`.
- Favicon e ícones (`favicon.ico`, `favicon-48.png`, `apple-touch-icon.png`, `icon-192/512.png`) recortados do símbolo da logo, com fundo branco.
- Os dados estruturados usam os horários do briefing; ao confirmar ou mudar os horários, atualizar também `src/seo.js`.

## Textos de SEO das páginas de serviço (rascunho, 25/09/2026)

Cada página de serviço ganhou a seção "Dúvidas sobre…" (campos `faqTitle`, `local` e `faq` em `src/content.js`), também enviada ao Google como FAQ nos dados estruturados. Revisão com a Capucho:

- Confirmado (25/09/2026): atendimento a clientes dos bairros vizinhos citados (Limão, Casa Verde, Brasilândia, Pirituba). A cobertura de retirada/entrega continua sendo confirmada pelo CEP.
- Confirmado (25/09/2026): suporte remoto com autorização do cliente, que acompanha tudo pela tela.
- Pendente: troca de thermal pads e cuidado com notebooks gamer — tirado do post da própria loja no Google (Predator PH315-55).
- Pendente: garantia de 90 dias, repetida no FAQ de conserto.

Perfil do Google conferido em 25/09/2026: nota 5,0 com 368 avaliações, categoria "Assistência Técnica de Informática", horários iguais aos do briefing e "Horário de atendimento on-line: 24 horas" (não usado no site; confirmar). O perfil aponta o site para biolinky.co e usa o nome "Capucho informatica".

## Vídeo da hero com transparência (25/09/2026)

Para a tela do notebook continuar branca sobre o fundo com faixas, `scripts/hero-alpha.mjs` gera `hero-montagem.webm` (1280 px) e `hero-montagem-720.webm` (celular) com canal alfa: o branco ligado às bordas de cada quadro vira transparência, e a tela, cercada pela moldura, fica opaca. O pôster `notebook-alpha.webp` é o último quadro. Chrome, Edge e Firefox usam o WebM. Safari e navegadores no iOS continuam no MP4 com `mix-blend-mode: multiply` (a tela ainda recebe o tom do fundo); para corrigir lá seria preciso um vídeo HEVC com alfa, gerado em um Mac. Se o vídeo da hero mudar, rodar `node scripts/hero-alpha.mjs` de novo.

## Depoimentos (25/09/2026)

A seção de avaliações usa seis trechos fiéis de avaliações públicas de 5 estrelas no Google: Naiwan, Bruno e Sérgio (prints recebidos) e Messias Castro, Lucas Alexandre e Eduarda Nonemacher (perfil no Maps). Sem fotos: avatares com iniciais. Três avaliações citam o Henrique pelo nome; confirmar que a Capucho aprova essa exposição.

## Área Gamer e Monte seu PC (29/09/2026)

Páginas `/gamer` (galeria de PCs montados, serviços para gamers e chamada para o montador) e `/gamer/monte-seu-pc` (montador por etapas no estilo do "Monte seu PC" da KaBuM, com checagem de compatibilidade: soquete, tipo de memória, potência da fonte, tamanho da placa e do radiador). A lista é enviada pelo WhatsApp para orçamento; a montagem é guardada só no navegador do visitante. Dados em `src/gamer.js`.

Pendente com o cliente:
- **Peças e preços do montador:** o catálogo atual é uma base inicial com valores **estimados** de mercado, só para o montador funcionar. Trocar pelos itens e preços reais da Capucho e marcar `stock: true` nas peças em estoque (o restante aparece como "Sob encomenda").
- Valor da montagem (hoje: "confirmado junto com o orçamento").
- Galeria de PCs montados: três vídeos da Capucho no carrossel (`gamerBuilds` em `src/gamer.js`); novos vídeos entram na mesma lista.
- A arte da hero da área gamer imita o estilo e os personagens de um jogo comercial. Confirmar se a Capucho quer assumir esse uso ou trocar por uma arte própria.
- O vídeo do setup gamer é uma animação ilustrativa, não um PC montado pela loja.

## Páginas de serviço específicas (09/10/2026)

Os serviços passaram a ter uma página cada, com a lógica sinal percebido → verificações → intervenção possível (referência de organização: imperiodastelascelular.com.br/troca-de-tela, sem copiar texto nem condições). Mapeamento:

| Antes | Agora |
| --- | --- |
| /servicos/conserto | Índice com links para diagnóstico, troca de tela, troca de hardware, reparo de placa e manutenção |
| /servicos/formatacao-e-programas | Índice com links para formatação e backup, instalação de softwares e suporte |
| /servicos/upgrade-e-montagem | Índice com links para upgrade de SSD e RAM, troca de hardware e área gamer |
| /servicos/limpeza-preventiva | Redirecionamento 301 para /servicos/manutencao-preventiva |
| /servicos/suporte-e-atendimento | Mantida |

Resinagem (10/10/2026): o usuário confirmou a definição — reparo estrutural para rachaduras e quebras na carcaça ou nos pontos de fixação (parafusos, suportes de dobradiça). Página criada em `/servicos/resinagem`, também listada no índice de `/servicos/conserto`.

Imagens: diagnóstico usa a antiga imagem de conserto (3D, sem fundo). Troca de tela, troca de hardware, reparo de placa, instalação de softwares e resinagem ficam sem foto por enquanto (o card mostra um ícone): as únicas imagens disponíveis para os quatro primeiros eram prints reais dos vídeos da loja, com fundo, fora do padrão 3D sem fundo das demais; resinagem nunca teve material próprio. Falta uma foto ou ilustração nesse padrão para cada um — o usuário vai providenciar.

Vídeos "Quem cuida do seu PC mostra como faz" (09/10/2026): três vídeos novos enviados pelo usuário, recodificados do mesmo jeito dos três originais (540×960, 30 fps, sem áudio, com versão leve para o carrossel do celular) — `reparo-placa`, `resinagem` e `manutencao-gamer` (manutenção preventiva em PC gamer), adicionados em `workVideos` sem remover os três já existentes.

Pendente com o cliente:
- Componentes trocados em troca de hardware: a página cita teclado, bateria, fonte, HD/SSD, ventoinha e placa-mãe (briefing, vitrine e avaliações). Confirmar se há outros, como tela touch, entrada de carregamento e carcaça.
- Backup: a página explica que é combinado antes e depende do disco; confirmar se o backup é cobrado à parte e como é feito.
- Troca de thermal pads na manutenção (mencionada como possibilidade).
- Se o diagnóstico/avaliação tem valor fixo por tipo de equipamento.

## Confirmar antes de publicar

- Horários de funcionamento e condições de garantia de 90 dias.
- Nota Google 5,0 e 366 avaliações, datadas no briefing de 25/09/2026. O print do total não foi encontrado nesta pasta; o site identifica a data dos dados recebidos.
- Autorização/atribuição dos comentários e uso dos vídeos.
- Foto final da fachada, incluindo textos e contatos corretos.
- Procedimentos de backup e cuidado com dados, formas de pagamento e cobrança de visita. A versão atual orienta consultar a equipe, sem inventar condições.
- Fotos de equipe e interior e referência final para o estilo dos cartões de serviços.

## Escolhas desta etapa

DESIGN_VARIANCE: 5. MOTION_INTENSITY: 1. VISUAL_DENSITY: 3.

Tema claro fixo, com fundo cinza-claro neutro (#eff0f2, antes gelo azulado #edf1f5) e cards brancos conforme revisão do usuário. Rodapé azul-marinho, grade de seis serviços em três colunas no desktop e repetição dos CTAs de WhatsApp preservam os requisitos do usuário, mesmo onde diferem dos padrões gerais da Taste. A única reprodução automática é o vídeo solicitado na hero. Não foram adicionados efeitos de interface, dark mode, página gamer, catálogo, preços ou captura de leads.
