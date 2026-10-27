# Carregamento do catálogo gamer

Em 27/10/2026 o usuário relatou que todas as peças tinham desaparecido. A leitura direta do Sanity encontrou 419 produtos elegíveis: 56 CPUs, 60 placas-mãe, 16 memórias, 19 GPUs, 35 unidades de armazenamento, 84 coolers, 35 fontes e 114 gabinetes. O filtro anterior à área Office e o filtro atual retornaram os mesmos 419 registros. Nenhum cadastro foi removido ou reativado nesta correção.

A falha relatada não se reproduziu na consulta inicial do navegador, que recebeu HTTP 200. Portanto, não foi possível atribuir uma causa de rede específica. O ponto frágil identificado foi o carregamento direto do domínio externo do Sanity/CDN pelo navegador, sem repetição automática e sem cache disponível no primeiro acesso.

O navegador agora consulta `GET /api/catalog`, na mesma origem do site. A função consulta o Sanity com perspectiva publicada e sem cache, usando a projeção existente, preservada em `shared/gamer-catalog.js`. Falhas retornam 503 em vez de uma lista vazia bem-sucedida. O cliente repete uma vez a consulta e mantém a recuperação pelo último catálogo válido ou pelo botão de nova tentativa. Cupons, preços, regras de compatibilidade e dados comerciais não foram alterados.

Validação: testes automatizados de falha transitória, recuperação de cache, falha sem cache, lista intencionalmente vazia, publicação e método somente leitura. Navegador em 1440 e 390px confere as oito categorias, com o domínio externo do Sanity bloqueado, falha inicial simulada, cache offline e recuperação manual. As consultas de preço antes do WhatsApp continuam no servidor.
