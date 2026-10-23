# Cupom de desconto

## Como administrar

Abra [o painel da Capucho](https://capucho.sanity.studio/) e selecione **Catálogo → Cupom de desconto**, no início da lista. É um documento único (`cupom-desconto`). Não há código ou benefício inicial: sem documento publicado, a oferta fica desativada.

Preencha código, tipo (porcentagem ou valor fixo em reais) e valor; ligue **Cupom ativo** e clique em **Publicar**. Para encerrar, desligue e publique. Rascunhos não alteram o site. Código obrigatório quando ativo; valor positivo; porcentagem até 100%; valor fixo com até duas casas decimais. Não é necessário alterar código nem fazer outro deploy para trocar a promoção.

## Integração

- Jornada existente: `/gamer` → `/gamer/monte-seu-pc` → orçamento pelo WhatsApp. Não há checkout de pagamento ou cobrança automática.
- `GET /api/coupon`: lê apenas o documento publicado, diretamente da API do Sanity. Não usa CDN, cache de navegador ou resposta estática pré-renderizada. Os avisos renovam na entrada, a cada 30 segundos enquanto a aba está visível, ao voltar à aba e ao focar a janela. Em falhas, o aviso anterior é retirado. Uma aba aberta pode levar até 30 segundos para refletir a publicação; aplicar e enviar sempre consultam novamente.
- `POST /api/quote`: aceita somente as escolhas por etapa e o código; preços, nomes e desconto enviados pelo navegador são ignorados. Uma consulta fornece o cupom publicado e os preços atuais das peças ativas e liberadas para o catálogo. Cada etapa admite uma peça. IDs desconhecidos ou peças removidas exigem revisão; itens sob consulta ficam identificados e fora da soma conhecida.
- Valores em centavos, arredondamento decimal de meio centavo para cima. Percentuais são calculados com razões inteiras; desconto fixo limitado ao subtotal. Frete e montagem/serviços separados não entram na base.
- O desconto só aparece após Aplicar e resposta válida do servidor. Não há acúmulo. Trocas/remoções de peças invalidam o resultado anterior e recalculam. Remover o cupom restaura o subtotal sem benefício.
- Antes do WhatsApp, o servidor recalcula tudo. Uma mudança de configuração ou preços atualiza o resumo e interrompe o envio para o cliente conferir e clicar novamente. Cupom inválido/desativado remove o benefício e informa o cliente. Falha de consulta não gera link nem confirma desconto: é possível tentar novamente.
- A revisão usa a versão do orçamento, incluindo peças e cupom publicado. Quando ainda não há versão, compara também nomes e preços de cada peça com o que estava exibido. Isso protege o primeiro envio e o envio após remover o cupom mesmo quando dois preços mudam em sentidos opostos e o subtotal permanece igual.
- Mensagem e URL do WhatsApp são geradas no servidor, com itens, subtotal, código, tipo/valor do benefício, desconto real e total, além da ressalva de confirmação pela Capucho. Como em todo orçamento por WhatsApp, a mensagem pode ser editada pelo próprio usuário; não equivale a uma transação ou cobrança garantida.
- Nenhuma promoção de teste é gravada no Sanity. Os dados dos testes existem apenas em fixtures locais.

## Operação e credenciais

O dataset público existente não exige token para leitura. IDs de projeto/dataset são públicos; nenhuma credencial de escrita é usada pelas APIs. Opcionalmente, `SANITY_PROJECT_ID`, `SANITY_DATASET` e `SANITY_READ_TOKEN` são variáveis **apenas do servidor**. Nunca usar prefixo `VITE_` para um token privado. A publicação do schema é feita pelo CLI autenticado do Studio; mudanças posteriores de conteúdo dispensam novo deploy.

Desenvolvimento local: `npm run dev` inclui as duas APIs no middleware do Vite. Na Vercel, os arquivos em `api/` são funções Node independentes. O build estático continua pré-renderizando as páginas, sem embutir uma promoção no HTML.

## Verificações

`npm test` (`node --test tests/coupon.test.js`): **19 testes aprovados**, sendo 17 iniciais e duas regressões da revisão por peça. Cobrem validações do painel, arredondamento, percentual, valor fixo/limite, código inválido/inativo, espaços/caixa, remoção, repetição, alteração de preços/configuração, produtos desconhecidos/sob consulta, entradas monetárias manipuladas, mensagem do WhatsApp, leitura publicada sem cache, métodos HTTP e falhas seguras.

Verificações de navegador usam o cálculo real do servidor com respostas Sanity simuladas, sem publicar promoções reais. A jornada completa passou nas larguras de **1440, 390, 360 e 768 px**, com 13 consultas de orçamento em cada execução e nenhum erro registrado em `.qa/coupon-browser-results.json`. Inclui aviso/cópia, renovação e retirada da oferta em falha, aplicar com espaços e variação de caixa, código inválido, remover cupom, trocar/remover peças, desconto fixo maior que o subtotal, falha/tentar novamente, edição de cupom e mudança de preços antes do envio, desativação e destino do WhatsApp.

A revisão visual abriu 14 capturas iniciais de `.qa/coupon-review/`. Identificou uma correção funcional: mudanças de preço por peça com subtotal igual precisavam interromper o envio também sem uma versão anterior válida. Após a correção, `.qa/check-coupon-equal-subtotal.mjs` passou em 1440 e 390 px nos casos de primeiro envio e envio após remover o cupom; o segundo clique permite seguir depois da conferência. Duas capturas adicionais registram o resumo atualizado. O parecer de revisão considerou o problema resolvido, sem solicitar polimento visual adicional.

Builds do site e do Studio aprovados. O site gerou 18 rotas e a página 404; permanece o aviso já existente de tamanho de chunk.

## Preservação da interface

Esta entrega estende o tema roxo já existente da área gamer e do montador. O aviso usa fundo roxo escuro (`#160e25`), borda roxa (`#77509c`), texto claro e ação lilás; o campo mantém fundo escuro, borda visível e cantos discretos. O CSS fica em `src/coupon.css`, com seletores próprios do cupom, valores e resumo. O aviso permite quebra de linha; abaixo de 599 px o campo e a ação também podem se reorganizar. Mensagens de cópia, validação, falha e atualização usam status acessível, e os botões ficam indisponíveis durante a consulta.

Não foram adicionados imagens, fontes ou bibliotecas. A detecção do novo componente e de seu CSS não encontrou problemas. A identidade azul/clara principal, os temas específicos das demais páginas, `DESIGN.md` e os documentos dos outros mundos visuais foram preservados. Esta é uma extensão da interface existente, sem uma nova direção visual ou arquivo global de tokens.

## Estado da publicação

O Studio com o schema do cupom foi publicado e confirmado em [capucho.sanity.studio](https://capucho.sanity.studio/). A consulta somente de leitura ao conteúdo publicado confirmou que o documento `cupom-desconto` estava ausente: a oferta permanece inicialmente desativada. Nenhuma promoção foi escrita em produção; os cupons dos testes são fixtures locais.

O site e suas APIs são publicados pelo fluxo GitHub → Vercel. A confirmação operacional exige o deploy concluído e respostas válidas de `/api/coupon` e `/api/quote`; publicar o Studio, isoladamente, não confirma essa etapa. Alterações posteriores de conteúdo no painel dispensam um novo deploy do site.

Referências técnicas: [API de consultas do Sanity](https://www.sanity.io/docs/http-reference/query), [perspectiva de conteúdo publicado](https://www.sanity.io/docs/content-lake/perspectives), [funções Node na Vercel](https://vercel.com/docs/functions/runtimes/node-js).
