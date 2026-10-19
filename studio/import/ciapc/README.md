# Importação do catálogo CIAPC para o Monte seu PC

Traz produtos, especificações e links do fornecedor (https://www.ciapc.com.br) para o painel Sanity da Capucho.
**Preço de venda, estoque, "Mostrar no site" e fotos continuam sendo do dono**: a importação não define nenhum deles.

## Como funciona

| Passo | Comando (dentro de `studio/`) | O que faz |
|---|---|---|
| 1. Coletar | `node import/ciapc/coletar.mjs` (`--teste` = 4 por listagem) | Percorre as listagens públicas (com paginação `?pg=N`) e lê cada página de produto. Pausa de 0,7 s entre pedidos, só rotas permitidas pelo `robots.txt`. Cache em `.cache/`. Gera `bruto.json`. |
| 2. Conferir cobertura | `node import/ciapc/verificar-cobertura.mjs` | Percorre as categorias-pai do site e lista o que ficou fora da coleta (deve ser só ventoinhas, armazenamento externo e plataformas antigas). |
| 3. Normalizar | `node import/ciapc/normalizar.mjs` | Classifica nas 8 etapas do montador, exclui o que não serve, extrai campos de compatibilidade, gera `normalizado.json` e `relatorio.md`. |
| 4. Simular | `node import/ciapc/importar.mjs` | Lê o painel (somente leitura), calcula o plano e grava `plano-importacao.json`. **Não grava nada.** |
| 5. Gravar | `SANITY_TOKEN=... node import/ciapc/importar.mjs --aplicar` | Só depois da revisão do dono. `SANITY_DATASET=outro` usa um dataset de testes. |

Testes locais (não tocam no painel real):

```
node import/ciapc/testar-importacao.mjs                    # idempotência e preservação do que é do dono
node import/ciapc/testar-montador.mjs                      # painel simulado -> montador (precisa do preview em :4173)
```

## Regras da importação

- **Peça nova**: `createIfNotExists` com `_id = ciapc-<SKU do fornecedor>`, `active: false`, **sem preço** e sem estoque.
  O dono liga "Mostrar no site" e pode preencher o preço ou deixá-lo vazio para exibir “Sob consulta”.
  Peças sem preço não entram na soma; uma configuração pronta com elas exibe “Preço sob consulta”.
- **Revisão técnica** (`revisao`): `pendente` quando falta algum dado essencial para conferir a compatibilidade
  (ex.: placa de vídeo sem comprimento). Peça pendente não aparece no montador, mesmo com preço e ativa. Depois de
  completar os campos no painel, o dono muda para "Revisada".
- **Rodar de novo**: não duplica. Em peças já importadas só atualiza o bloco `fornecedor` (cópia dos dados do
  fornecedor, incluindo disponibilidade observada e data da coleta) e preenche campos técnicos que estejam vazios.
  Preço, estoque, ativação, nome, resumo, foto e revisão ficam como o dono deixou.
- **Produto que sumiu do fornecedor**: nunca é apagado; recebe `fornecedor.situacao = "nao-encontrado-na-ultima-coleta"`.
- **Peças antigas da Capucho** (as 47 da lista inicial): intocadas. Possíveis equivalentes são listados em
  `plano-importacao.json` (`possiveisEquivalentes`) para o dono decidir.
- **Imagens**: uso autorizado pelo dono (a CIAPC é fornecedora da Capucho). `node import/ciapc/imagens.mjs` baixa e otimiza (WebP, 480 px) para `public/assets/catalogo/<SKU>.webp`; o montador usa essa foto quando a peça não tem foto enviada no painel. A origem fica em `fornecedor.imagem`.
- **Nada é inventado**: campo que a ficha do fornecedor não informa fica em branco e aparece em
  `fornecedor.pendencias`. Medidas sem rótulo de eixo (ex.: "140 x 110 x 160 mm") não viram altura de cooler.

## Escopo

Etapas: processador, placa-mãe, memória (DIMM de desktop), placa de vídeo, armazenamento (SSD/NVMe/HD internos),
cooler de processador (ar e water cooler), fonte e gabinete. Plataformas: AM4, AM5, LGA1700, LGA1851 e LGA1200.
Ficam de fora: SO-DIMM/notebook, armazenamento externo ou SAS, ventoinhas de gabinete, acessórios, produtos usados ou
open box, computadores completos, periféricos e plataformas antigas (LGA115x/DDR3).

## Atenção

- O Studio só mostra os campos novos (`revisao`, `fornecedor`, comprimento da placa etc.) depois de publicar o schema:
  `cd studio && npx sanity deploy`. A importação funciona sem isso, mas o dono não verá os campos até o deploy.
- O site público lê o Sanity diretamente ao abrir o montador, sem precisar de `?painel` nem de novo deploy para
  mudanças de conteúdo. Categorias vazias continuam vazias. Em falhas de rede, usa a última resposta salva
  neste navegador com aviso; sem cache, oferece indicação pelo WhatsApp sem preços de exemplo.
- Nunca rode `import/gerar-catalogo.mjs` com `--replace` depois da importação: ele recria o painel do zero e apaga peças
  importadas e preços do dono.
