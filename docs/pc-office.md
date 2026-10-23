# PC Office — guia de administração e entrega

Atualizado em 23/10/2026. Esta área estende o site existente: mantém o visual claro, azul e marinho, com DM Sans/Sora. Não exige mudanças no sistema visual global. A direção da superfície está em `docs/office-direction.md`.

## Estado da entrega

- Studio publicado em https://capucho.sanity.studio/, com a entrada **PC Office**.
- Importação inicial executada com `studio/import/office.mjs`: **28 rascunhos**, sendo 21 processadores, duas placas-mãe, dois kits de RAM, um gabinete e dois documentos de configuração. Uma segunda execução criou zero documentos e preservou os 28 existentes.
- Nenhum produto ou promoção foi publicado por esta entrega. Os cadastros iniciais estão desativados, sem estoque liberado e com revisão pendente quando aplicável.
- O site segue o fluxo de publicação da branch principal na Vercel. A publicação do painel é independente da ativação comercial dos produtos.
- Preços, disponibilidade e especificações comerciais vêm exclusivamente dos documentos publicados no Sanity. Valores e configurações usados nos testes são fictícios e ficam restritos às fixtures locais; não foram enviados ao catálogo de produção.

## Páginas e implementação

| Página | Função |
| --- | --- |
| `/pc-office` | Apresenta os dois caminhos: montar um computador ou escolher um Mini PC pronto. |
| `/pc-office/monte-seu-pc` | Quatro etapas: processador, placa-mãe, memória e SSD; gabinete, fonte, cooler e extras aparecem no resumo com seus valores. |
| `/pc-office/mini-pc` | Escolha exclusiva entre i3, i5 e i7; memória, armazenamento e demais especificações são comuns às três versões. |

`src/pages/OfficePage.jsx` contém a apresentação `OfficePage`, o montador `OfficeBuilder` e os elementos locais de foto, navegação estrutural, opção, cupom e estado vazio. `src/office.css` limita os estilos à superfície Office. Há entrada na navegação e no rodapé, rotas em `src/App.jsx` e metadados/rotas de SEO e pré-renderização integrados ao projeto.

A implementação reutiliza `CouponOffer`, `useOrderQuote`, o contato real em `src/config.js` e as funções de cupom/cálculo em centavos. As regras Office ficam em `shared/office.js`, usadas pelo navegador e pelo servidor. `GET /api/office` consulta o catálogo; `POST /api/quote` encaminha pedidos `office` e `mini` para `server/office.js`, preservando o fluxo Gamer. Peças marcadas como exclusivas do Office são excluídas do catálogo e do orçamento Gamer.

## Onde administrar

Entre no [Sanity Studio da Capucho](https://capucho.sanity.studio/) e abra **Catálogo > PC Office**. A entrada reúne:

- **Montagem · itens inclusos e liberação**: documento único `officeConfig`, ID `pc-office`.
- **Mini PC · versões e preços**: documento único `officeMini`, ID `mini-pc-office`.
- **Processadores, Placas-mãe, Memórias, Armazenamento, Coolers, Fontes e Gabinetes**: usam o schema existente `peca`.

Os documentos únicos não oferecem duplicação ou exclusão no painel. As listas Office criam peças com os campos de Office preparados, inicialmente desativadas. A lista de armazenamento também mostra os produtos já cadastrados no Gamer: edite o mesmo SSD, sem duplicá-lo.

Salvar um rascunho não altera a oferta pública. Depois de verificar os dados, use **Publicar/Publish** no documento correspondente. O site usa apenas a versão publicada. Para retirar uma oferta já publicada, desmarque sua liberação ou estoque e publique a mudança; deixar apenas uma alteração em rascunho mantém a versão publicada anterior em vigor.

## 1. Completar os componentes do montador

Em cada peça, preencha nome/modelo exato, marca, resumo técnico, foto, preço real da Capucho e estoque. Para aparecer e ser aceita no orçamento Office, a peça precisa estar publicada, com **Mostrar no site** e **Em estoque** ligados, **Revisão técnica: Revisada** e preço positivo. Informe preços em reais, preferencialmente com até duas casas decimais; os cálculos são arredondados consistentemente para centavos. Nas peças Office, marque **Usar no PC Office**. Use **Exclusiva do Office (ocultar no Gamer)** quando o item não deva entrar no montador Gamer.

### Processadores

Os 21 rascunhos correspondem ao briefing:

| Família | 2ª geração | 3ª geração |
| --- | --- | --- |
| i3 | i3-2100, i3-2120, i3-2130 | i3-3220, i3-3240, i3-3250 |
| i5 | i5-2300, i5-2310, i5-2320, i5-2400, i5-2500 | i5-3330, i5-3340, i5-3450, i5-3470, i5-3570 |
| i7 | i7-2600, i7-2600K, i7-2700K | i7-3770, i7-3770K |

Confira **Família Intel Office**, **Geração Intel**, soquete `LGA1155`, vídeo integrado e TDP real. Os rascunhos não afirmam suporte: cada modelo ainda precisa de uma linha de confirmação de CPU/BIOS na placa-mãe. Para adicionar um modelo, crie uma peça nesta lista e revise também as placas que poderão aceitá-lo. Para removê-lo da oferta, desative e publique; revise as referências de suporte.

### Placas-mãe H61 e B75

Substitua o nome genérico do rascunho pelo fabricante, modelo e revisão reais. Preencha chipset `H61` ou `B75`, soquete `LGA1155`, memória `DDR3`, tamanho físico, **Slots de memória** (`memSlots`), **Memória máxima (GB)** (`memMax`) e **Portas SATA** (`sataPorts`, maior que zero para SSD SATA).

Em **Processadores e BIOS validados** (`officeCpuSupport`), crie uma linha para cada processador exato suportado: selecione a referência da CPU, informe a versão de BIOS verificada e marque **Suporte confirmado neste modelo/revisão de placa**. Confirme a BIOS instalada e registre evidências técnicas antes da liberação. Mesmo chipset ou soquete não bastam.

Em **Kits de memória validados** (`officeRamSupport`) e **SSDs SATA 2,5” validados (cadastro existente)** (`officeStorageSupport`), selecione os documentos exatos aprovados. Só depois marque **Placa-mãe Office revisada (modelo, revisão e BIOS)** (`officeVerified`). O registro interno da aprovação do conjunto fica no documento de montagem.

### Memória de 8 GB e 16 GB DDR3

Complete marca/modelo, capacidade total, número de módulos do kit e frequência reais. O campo **Capacidade total (GB)** deve ser 8 ou 16; o tipo deve ser `DDR3`. O número de módulos precisa ser positivo e caber nos slots da placa; a capacidade total precisa respeitar `memMax`. Além disso, o kit deve estar na lista de memórias aprovadas daquela placa. Não cadastre apenas “16 GB” sem confirmar sua composição.

### SSD: reaproveitar o cadastro existente

Em **PC Office > Armazenamento**, abra o SSD já usado no Gamer. Confirme **Interface: SATA** (`iface: 'sata'`), preencha **Formato físico** exatamente como `2.5` — sem aspas, vírgula ou unidade — e marque **SSD validado para uso no Office** (`officeSsd`). Adicione a referência desse mesmo documento em `officeStorageSupport` de cada placa aprovada. Não é necessário tornar o SSD exclusivo do Office nem criar outro documento.

NVMe e M.2 SATA não passam por esta regra. Confirme também fixação física, alimentação e cabo de dados. A aprovação por placa é obrigatória mesmo para um SSD SATA de 2,5 polegadas.

### Gabinete, fonte e cooler

O gabinete é único: **Hayom Office GB1752 preto, Micro-ATX**, com `officeModel: 'GB1752'`. Confira formatos de placa aceitos, formatos de fonte e altura máxima do cooler. A importação traz dados de referência do gabinete; a revisão técnica da unidade comercial continua necessária.

Cadastre ou aproveite documentos reais de fonte e cooler, marque seu uso no Office e complete os preços individuais. Na fonte, informe potência e formato; no cooler, soquetes aceitos, altura e TDP máximo suportado. O cooler precisa aceitar `LGA1155`, caber na altura do gabinete e suportar o TDP da CPU. A fonte deve caber no gabinete e atender à potência mínima aprovada para a montagem.

Gabinete, fonte e cooler são três referências separadas, com preço positivo: seus valores são somados ao orçamento, embora o cliente não os escolha individualmente. Não considere uma fonte ou cooler gratuito apenas porque acompanha outra peça; revise a distribuição dos custos para evitar omissão ou cobrança duplicada.

## 2. Liberar a montagem completa

Abra **PC Office > Montagem · itens inclusos e liberação** e siga esta ordem:

1. Selecione o gabinete único, a **Fonte inclusa** e o **Cooler incluso** pelos respectivos documentos publicados e aprovados.
2. Em **Placas-mãe aprovadas nesta montagem**, selecione somente as placas que passaram pela revisão e pelas matrizes de CPU/BIOS/RAM/SSD.
3. Informe **Potência mínima da fonte para o conjunto (W)** (`requiredWatts`), definida pelo técnico para a pior combinação liberada, e não apenas para a configuração mais leve.
4. Cadastre ventoinhas, cabos, adaptadores e outros itens necessários em **Demais componentes inclusos**, cada um com nome e preço. Preço zero só é correto quando o custo já está embutido em outra peça do orçamento; registre essa distribuição no controle da Capucho.
5. Escreva em **O que acompanha a montagem** (`includedNotes`) o texto público dos demais itens inclusos. Ele acompanha o resumo e a mensagem de WhatsApp.
6. Após a conferência dos custos, marque **Todos os itens e custos necessários estão considerados** (`extrasConfirmed`).
7. Confira manualmente todas as combinações liberadas: encaixe, BIOS instalada, conectores da fonte, alimentação, vídeo integrado e saídas da placa, cooler, ventilação, RAM, fixação do SSD e cabos. Marque **Conjunto completo validado tecnicamente** (`baseConfirmed`) somente após concluir essa revisão.
8. Preencha **Registro interno da aprovação técnica** (`approvalNotes`) com responsável, data e critérios/evidências. O texto não é exibido ao visitante.
9. Ative **Liberar configurações no site** e publique. Confira o fluxo completo no site quando a implantação estiver disponível.

As regras automáticas verificam os campos e referências acima, o formato físico da placa no gabinete e as capacidades declaradas. A aprovação manual cobre aspectos que o código não consegue provar, como pinagem, conectores reais, revisão da unidade, ventilação e segurança de todas as combinações. Alterações de peças ou limites exigem nova conferência técnica.

Ao trocar de placa no configurador, escolhas ainda compatíveis são mantidas; CPU, RAM ou SSD incompatíveis são removidos. Seleções salvas no navegador também são conferidas com o catálogo atualizado. Uma montagem incompleta, desativada, sem preço/estoque ou sem confirmação técnica não habilita o pedido.

## 3. Cadastrar o Mini PC

Abra **PC Office > Mini PC · versões e preços**. Este produto tem configuração fixa e não utiliza referências às peças do montador.

1. Preencha nome real, foto, **Memória (igual nas três versões)**, **Armazenamento (igual nas três versões)** e **Configuração fixa e itens inclusos**. Registre modelo do Mini PC, conectividade, sistema, fonte e demais itens confirmados.
2. Os textos iniciais de 8 GB e SSD de 256 GB são referências editáveis do briefing; confirme-os antes de divulgar. A foto de referência não confirma capacidade, processador ou sistema da oferta.
3. Mantenha exatamente três versões, uma de cada família: i3, i5 e i7. Em cada versão, informe o **Modelo exato do processador**, o **Preço completo desta versão (R$)** e sua disponibilidade real. Este é o preço do computador completo, não apenas da CPU.
4. Marque **Modelo e compatibilidade confirmados neste Mini PC**, **Disponível em estoque** e **Liberar esta versão** apenas quando os dados daquela versão estiverem corretos. Cada versão tem preço e disponibilidade independentes.
5. Após confirmar que memória, SSD e demais itens são realmente iguais nas três versões, marque **Configuração fixa e compatibilidade confirmadas** (`fixedConfirmed`), ative **Mostrar Mini PC no site** e publique.

Não copie a lista de CPUs LGA1155 do montador para o Mini PC. Os três modelos exatos precisam ser confirmados para o equipamento comercial escolhido. Se as versões disponíveis tiverem memória ou SSD diferentes, resolva a oferta comum antes de liberar: o cadastro atual prevê apenas uma configuração fixa compartilhada.

## 4. Preços, cupons e conferência do pedido

Para atualizar preços, estoque, nomes, descrições ou fotos, edite o documento correspondente e publique. Para o Mini, os três preços ficam nas versões do documento único. Para a montagem, o total soma quatro peças escolhidas, gabinete, fonte, cooler e extras. Não há tabela comercial fixa no código.

O cupom continua em **Catálogo > Cupom de desconto**, fora da entrada PC Office, usando o documento existente `cupom-desconto`. O visitante precisa aplicá-lo explicitamente. Percentual e valor fixo usam o cálculo existente em centavos; o desconto não supera o subtotal elegível. Frete e serviços cobrados separadamente não entram no desconto.

O servidor consulta o Sanity diretamente, com perspectiva publicada e sem cache. O navegador atualiza o catálogo a cada 30 segundos enquanto a página está visível e ao retomar o foco. Antes de abrir o WhatsApp, o servidor consulta novamente preços, estoque, compatibilidade e cupom. Se o resumo mudar, a página apresenta os valores/especificações atualizados e solicita outro clique para conferência. Cupom inválido é removido e impede o envio naquela tentativa; falha de consulta mantém a compra bloqueada e oferece nova tentativa.

A mensagem do montador inclui componentes, modelos, preços, BIOS validada, inclusos, subtotal, cupom, desconto e total. A mensagem do Mini inclui versão/modelo exato, configuração fixa e preço completo. O orçamento final, disponibilidade e prazo continuam sujeitos à confirmação da Capucho pelo WhatsApp.

## Schemas e campos alterados

- **Novos:** `officeConfig` e `officeMini`, definidos em `studio/schemas/office.js`.
- **Reutilizado e ampliado:** `peca`, com os campos `office`, `officeOnly`, `officeSsd`, `family`, `generation`, `officeModel`, `officeVerified`, `officeCpuSupport`, `officeRamSupport` e `officeStorageSupport`. A lista de soquetes inclui `LGA1155`.
- **Reutilizados:** preço, estoque, revisão, foto e características técnicas existentes de CPU, placa, RAM, SSD, gabinete, fonte e cooler; o schema de cupom existente é preservado.
- **Studio:** estrutura PC Office e modelo de criação de peça Office em `studio/sanity.config.js`. SSDs mantêm o cadastro compartilhado.

O script `studio/import/office.mjs` cria somente cadastros ausentes, preserva documentos publicados ou em rascunho com os mesmos IDs e não publica nada. A partir da pasta `studio`, sua execução técnica é `npx sanity exec import/office.mjs --with-user-token`; ele não é necessário para editar os 28 documentos já criados.

## Fotos e informações ainda pendentes

As imagens WebP em `public/assets/office/` derivam de fotos reais oficiais da Hayom e da PCYES One B300; origens e finalidade estão em `docs/office-assets.json`. A imagem PCYES é referência de formato: a configuração do produto de origem não é copiada para a oferta. Troque as referências por fotos adequadas da oferta confirmada no Sanity.

Para disponibilizar a área comercial, a Capucho ainda precisa fornecer ou confirmar:

- Preços reais, estoque e fotos dos componentes.
- Fabricante, modelo, revisão e BIOS das placas H61/B75; matrizes verificadas de suporte a cada CPU, kit de RAM e SSD.
- Modelos e características reais de fonte e cooler, potência mínima do conjunto, ventilação, cabos/adaptadores e seus custos.
- Aprovação técnica de todas as combinações liberadas e registro do responsável.
- Modelo comercial exato do Mini PC, três CPUs específicas, três preços/disponibilidades e configuração fixa comum confirmada.

Enquanto essas informações faltarem, mantenha os cadastros incompletos em rascunho/desativados. O visitante encontra o estado de preparação, sem poder enviar a configuração incompleta como pedido.

## Verificação realizada

A entrega registrou 51 testes Node aprovados, cobrindo cupons e regras Office. O roteiro local `.qa/office/browser.mjs` verificou larguras de 360, 390, 768 e 1440 px, com sete consultas de orçamento por largura: seleção, cupom percentual, remoção, código inválido, desconto fixo limitado ao subtotal, alteração de preço antes do envio, conferência de especificação fixa do Mini, catálogo vazio, falha e nova tentativa. Também verificou navegação móvel, ausência de transbordamento horizontal e de erros de página.

As capturas estão em `.qa/office/captures/`. O WhatsApp foi interceptado no teste; nenhuma mensagem foi enviada. Fixtures de demonstração não fazem parte do catálogo de produção. O build gerou 21 páginas e a página 404; o painel compilou e foi publicado. A revisão independente teve disposição **ship**, mantendo as restrições de compra até a Capucho confirmar os dados reais. A consulta direta ao Sanity confirmou que os rascunhos ficam ocultos e que pedidos incompletos são bloqueados. A conferência e publicação dos dados comerciais reais continuam necessárias antes de disponibilizar os produtos para compra.
