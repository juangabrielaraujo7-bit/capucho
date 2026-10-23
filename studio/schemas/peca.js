import { defineField, defineType } from "sanity";
import { officeFields } from './office.js';

// Etapas do montador. "value" é o mesmo id usado no site (src/gamer.js).
export const categories = [
  { value: "cpu", title: "Processadores" },
  { value: "board", title: "Placas-mãe" },
  { value: "ram", title: "Memórias" },
  { value: "gpu", title: "Placas de vídeo" },
  { value: "storage", title: "Armazenamento" },
  { value: "cooler", title: "Coolers" },
  { value: "psu", title: "Fontes" },
  { value: "case", title: "Gabinetes" },
];

const sockets = ["AM4", "AM5", "LGA1700", "LGA1851", "LGA1200", "LGA1155"];
const memories = ["DDR3", "DDR4", "DDR5"];
const forms = [
  { value: "mITX", title: "Mini-ITX" },
  { value: "mATX", title: "Micro-ATX" },
  { value: "ATX", title: "ATX" },
  { value: "EATX", title: "E-ATX" },
];

// Campo técnico que só aparece (e só é obrigatório) nas categorias indicadas.
const only = (cats) => ({
  hidden: ({ parent }) => !cats.includes(parent?.category),
  validation: (rule) =>
    rule.custom((value, { parent }) =>
      cats.includes(parent?.category) && (value === undefined || value === null || value === "")
        ? "Obrigatório para o montador checar a compatibilidade"
        : true,
    ),
});

// Campo técnico opcional, visível só nas categorias indicadas.
const opt = (cats) => ({ hidden: ({ parent }) => !cats.includes(parent?.category) });

export const peca = defineType({
  name: "peca",
  title: "Peça",
  type: "document",
  fields: [
    ...officeFields,
    defineField({
      name: "category",
      title: "Etapa do montador",
      type: "string",
      options: { list: categories, layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Nome",
      description: "Ex.: AMD Ryzen 5 5600 / GeForce RTX 5060 8 GB",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Marca",
      description: "Aparece no filtro do montador (processador, placa-mãe e placa de vídeo).",
      type: "string",
      options: { list: ["AMD", "Intel", "NVIDIA"], layout: "radio", direction: "horizontal" },
      hidden: ({ parent }) => !["cpu", "board", "gpu"].includes(parent?.category),
    }),
    defineField({
      name: "specs",
      title: "Resumo técnico",
      description: "Uma linha curta. Ex.: 6 núcleos, 12 threads, até 4,4 GHz, AM4",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Preço estimado (R$)",
      type: "number",
      description: "Sem preço, a peça aparece no montador como “Sob consulta” e não entra na soma.",
      validation: (rule) =>
        rule.custom((value) => {
          if (value == null) return true;
          return Number.isFinite(value) && value > 0 ? true : "Informe um preço maior que zero ou deixe vazio para Sob consulta";
        }),
    }),
    defineField({
      name: "stock",
      title: "Em estoque",
      description: "Desligado aparece como “Sob encomenda”.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "Mostrar no site",
      description: "Desligue para esconder a peça sem apagar.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "image",
      title: "Foto",
      description: "De preferência com fundo transparente (PNG).",
      type: "image",
    }),

    // Compatibilidade
    defineField({ name: "socket", title: "Soquete", type: "string", options: { list: sockets, layout: "radio", direction: "horizontal" }, ...only(["cpu", "board"]) }),
    defineField({ name: "memory", title: "Tipo de memória", type: "string", options: { list: memories, layout: "radio", direction: "horizontal" }, ...only(["board", "ram"]) }),
    defineField({ name: "form", title: "Tamanho da placa-mãe", type: "string", options: { list: forms, layout: "radio", direction: "horizontal" }, ...only(["board"]) }),
    defineField({ name: "igpu", title: "Tem vídeo integrado?", type: "boolean", initialValue: false, ...only(["cpu"]) }),
    defineField({ name: "boxCooler", title: "Vem com cooler na caixa?", type: "boolean", initialValue: false, ...only(["cpu"]) }),
    defineField({ name: "tdp", title: "TDP do processador (W)", type: "number", ...only(["cpu"]) }),
    defineField({ name: "psu", title: "Fonte recomendada (W)", description: "Potência mínima indicada pelo fabricante da placa de vídeo.", type: "number", ...only(["gpu"]) }),
    defineField({ name: "maxTdp", title: "TDP máximo que o cooler aguenta (W)", type: "number", ...only(["cooler"]) }),
    defineField({
      name: "radiator",
      title: "Radiador do water cooler (mm)",
      description: "Deixe vazio para cooler a ar.",
      type: "number",
      options: { list: [120, 140, 240, 280, 360, 420] },
      hidden: ({ parent }) => parent?.category !== "cooler",
    }),
    defineField({ name: "watts", title: "Potência da fonte (W)", type: "number", ...only(["psu"]) }),
    defineField({
      name: "forms",
      title: "Placas-mãe que cabem",
      type: "array",
      of: [{ type: "string" }],
      options: { list: forms, layout: "grid" },
      ...only(["case"]),
    }),
    defineField({ name: "caseRadiator", title: "Maior radiador que cabe (mm)", type: "number", options: { list: [120, 140, 240, 280, 360, 420] }, ...only(["case"]) }),

    // Revisão técnica e dados do fornecedor (importação CIAPC, studio/import/ciapc)
    defineField({
      name: "revisao",
      title: "Revisão técnica",
      description: "“Pendente” = faltam dados para o montador conferir a compatibilidade; a peça não aparece no site até a revisão ficar “ok”.",
      type: "string",
      options: { list: [{ value: "pendente", title: "Pendente de revisão" }, { value: "ok", title: "Revisada" }], layout: "radio", direction: "horizontal" },
    }),
    defineField({
      name: "fornecedor",
      title: "Dados do fornecedor (somente leitura)",
      description: "Origem da peça no fornecedor. Atualizado pela importação; preço, estoque e “Mostrar no site” nunca são tocados por ela.",
      type: "object",
      readOnly: true,
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "fonte", title: "Fornecedor", type: "string" },
        { name: "sku", title: "Código do fornecedor", type: "string" },
        { name: "modelo", title: "Código do fabricante", type: "string" },
        { name: "gtin", title: "EAN/GTIN", type: "string" },
        { name: "nomeOriginal", title: "Nome no fornecedor", type: "string" },
        { name: "url", title: "Página de origem", type: "url" },
        { name: "imagem", title: "Imagem no fornecedor (não usada no site)", type: "url" },
        { name: "imagemStatus", title: "Uso da imagem", type: "string" },
        { name: "disponibilidade", title: "Disponibilidade observada no fornecedor", type: "string" },
        { name: "condicao", title: "Condição", type: "string" },
        { name: "situacao", title: "Situação na última coleta", type: "string" },
        { name: "coletadoEm", title: "Coletado em", type: "datetime" },
        { name: "pendencias", title: "Dados que faltam", type: "array", of: [{ type: "string" }] },
        { name: "especificacoes", title: "Especificações coletadas", type: "text", rows: 6 },
        { name: "complementos", title: "Dados complementados (fonte)", type: "array", of: [{ type: "string" }] },
      ],
    }),

    // Compatibilidade detalhada (opcional: quando falta, o montador avisa que a Capucho confere)
    defineField({ name: "chipset", title: "Chipset", type: "string", ...opt(["board"]) }),
    defineField({ name: "chipsets", title: "Chipsets que o processador lista como compatíveis", type: "array", of: [{ type: "string" }], ...opt(["cpu"]) }),
    defineField({ name: "memSlots", title: "Slots de memória", type: "number", ...opt(["board"]) }),
    defineField({ name: "memMax", title: "Memória máxima (GB)", type: "number", ...opt(["board"]) }),
    defineField({ name: "m2Slots", title: "Slots M.2 (NVMe)", type: "number", ...opt(["board"]) }),
    defineField({ name: "sataPorts", title: "Portas SATA", type: "number", ...opt(["board"]) }),
    defineField({ name: "gb", title: "Capacidade total (GB)", type: "number", ...opt(["ram", "storage"]) }),
    defineField({ name: "modules", title: "Módulos no kit", type: "number", ...opt(["ram"]) }),
    defineField({ name: "speed", title: "Frequência (MHz)", type: "number", ...opt(["ram"]) }),
    defineField({ name: "length", title: "Comprimento (mm)", type: "number", ...opt(["gpu"]) }),
    defineField({ name: "vram", title: "Memória de vídeo (GB)", type: "number", ...opt(["gpu"]) }),
    defineField({ name: "slots", title: "Slots que a placa ocupa", type: "number", ...opt(["gpu"]) }),
    defineField({ name: "pcie8", title: "Conectores PCIe de 8 pinos exigidos / oferecidos", description: "Placa de vídeo: quantos exige. Fonte: quantos oferece (6+2 pinos).", type: "number", ...opt(["gpu", "psu"]) }),
    defineField({ name: "p16", title: "Conector de 16 pinos (12VHPWR / 12V-2x6)", description: "Placa de vídeo: exige. Fonte: oferece.", type: "boolean", ...opt(["gpu", "psu"]) }),
    defineField({ name: "iface", title: "Interface", type: "string", options: { list: [{ value: "sata", title: "SATA" }, { value: "nvme", title: "M.2 NVMe" }, { value: "m2-sata", title: "M.2 SATA" }], layout: "radio", direction: "horizontal" }, ...opt(["storage"]) }),
    defineField({ name: "storageForm", title: "Formato físico", type: "string", ...opt(["storage"]) }),
    defineField({ name: "sockets", title: "Sockets compatíveis", type: "array", of: [{ type: "string" }], options: { list: sockets }, ...opt(["cooler"]) }),
    defineField({ name: "height", title: "Altura do cooler a ar (mm)", type: "number", ...opt(["cooler"]) }),
    defineField({ name: "maxGpu", title: "Comprimento máximo da placa de vídeo (mm)", type: "number", ...opt(["case"]) }),
    defineField({ name: "maxCooler", title: "Altura máxima do cooler a ar (mm)", type: "number", ...opt(["case"]) }),
    defineField({ name: "psuForms", title: "Formatos de fonte aceitos", type: "array", of: [{ type: "string" }], ...opt(["case"]) }),
    defineField({ name: "psuForm", title: "Formato da fonte", type: "string", ...opt(["psu"]) }),
  ],
  preview: {
    select: { title: "name", price: "price", stock: "stock", active: "active", revisao: "revisao", media: "image" },
    prepare: ({ title, price, stock, active, revisao, media }) => ({
      title,
      subtitle: [
        price != null ? `R$ ${price.toLocaleString("pt-BR")}` : "Sem preço",
        stock ? "Em estoque" : "Sob encomenda",
        revisao === "pendente" ? "Revisão pendente" : null,
        active === false ? "Oculta" : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});

export const schemaTypes = [peca];
