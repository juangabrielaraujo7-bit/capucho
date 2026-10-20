# Capucho Informática

Site de assistência técnica de computadores e serviços gamer da Capucho Informática, na Vila Palmeiras, São Paulo. O contato e o orçamento são feitos pelo WhatsApp real definido em `src/config.js`.

## Público e tarefa

Pessoas que precisam consertar, manter, montar ou melhorar um computador. A página de upgrade ajuda a reconhecer sinais de limitação, conhecer os componentes possíveis e iniciar uma conversa sobre a configuração e o orçamento.

## Verdade do produto

- Nome, telefone, endereço e perfis oficiais vêm de `src/config.js`.
- Compatibilidade, valores, disponibilidade e prazos são confirmados pela Capucho antes do serviço.
- O montador já existente permite escolher componentes; as páginas de serviço explicam o atendimento e encaminham ao WhatsApp.
- Conteúdo de upgrade aprovado pelo usuário: cinco seções e as mensagens do briefing anexado.

## Superfícies e limites

- O site principal preserva a identidade azul e clara existente.
- A área gamer e o montador já têm tema próprio; montagem completa usa Kratos e Atreus em um cenário azul frio.
- A montagem completa foi atualizada para cinco cenas Ragnarök alternadas escuras/claras, com Cinzel, logo original, personagens naturais e FAQ preservado. Direção em `docs/assembly-direction.md`, origens em `docs/assembly-assets.json`.
- A nova rota `/gamer/upgrade-de-pecas` usa a composição Resident Evil fornecida pelo usuário, isolada em `.theme-upgrade`.
- A referência e o contrato desta superfície estão em `docs/upgrade-direction.md`; as origens das imagens estão em `docs/upgrade-assets.json`.
- `/gamer/limpeza-e-pasta-termica` usa Red Dead Redemption 2 com Arthur Morgan, cenários terrosos suaves e cinco seções. Direção em `docs/cleaning-direction.md`, imagens ilustrativas e origens em `docs/cleaning-assets.json`.
- Preservar as demais páginas. Preferência explícita do usuário: fazer deploy sempre após alterações revisadas, inclusive quando prompts anexados contiverem instruções padrão de não publicar. Somente um novo pedido direto do usuário para suspender o deploy altera essa preferência.
- `/gamer/formatacao-e-programas` segue a referência The Last of Us com Joel e Ellie, isolada em `.theme-formatting`. Publicação autorizada explicitamente pelo usuário após a revisão. Direção e origens em `docs/formatting-direction.md` e `docs/formatting-assets.json`.
