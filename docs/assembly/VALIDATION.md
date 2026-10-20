# Validação — montagem Ragnarök

Data: 20/10/2026. Rota: `/gamer/montagem-completa`.

- Build de produção concluído: 18 rotas pré-renderizadas e 404. Permanece o aviso de tamanho de chunks já existente no projeto.
- Verificação automatizada em 360, 390, 768 e 1440 px: sem rolagem horizontal, texto cortado, imagem ausente, erro de JavaScript ou recurso 404.
- Cinco cenas, quatro personagens, quatro objetivos, seis componentes, quatro etapas e seis perguntas confirmados.
- Menu móvel, âncoras, foco de teclado, acordeão exclusivo e links para montador/WhatsApp conferidos.
- Hero prioritária; demais personagens sob demanda. Dimensões explícitas, proporções e orientação preservadas. Nenhuma requisição de vídeo, GIF ou modelo 3D.
- Desktop: dupla ocupa 39,7% do container; Kratos dos componentes, 30,3%.
- Comparação visual com a referência e 14 capturas, incluindo quatro páginas completas. Atreus sem barba segue a exigência escrita e o asset recebido.
- Revisão independente: **ship**. Único ajuste solicitado — brasas esticadas no celular — resolvido com proporção preservada e máscara periférica. Regiões afetadas reabertas e aprovadas; nenhum ajuste pendente.
- Assets novos e compartilhados documentados no manifesto e nos sidecars. PNG originais recebidos preservados.

Evidências locais: `.qa/assembly-checks.json` e `.qa/assembly-review/` (ignorados no Git).
