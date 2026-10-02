import { defineField, defineType } from "sanity";

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

const sockets = ["AM4", "AM5", "LGA1700", "LGA1851"];
const memories = ["DDR4", "DDR5"];
const forms = [
  { value: "mATX", title: "Micro-ATX" },
  { value: "ATX", title: "ATX" },
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

export const peca = defineType({
  name: "peca",
  title: "Peça",
  type: "document",
  fields: [
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
      validation: (rule) => rule.required().min(0),
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
      options: { list: [240, 280, 360] },
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
    defineField({ name: "caseRadiator", title: "Maior radiador que cabe (mm)", type: "number", options: { list: [240, 280, 360] }, ...only(["case"]) }),
  ],
  preview: {
    select: { title: "name", price: "price", stock: "stock", active: "active", media: "image" },
    prepare: ({ title, price, stock, active, media }) => ({
      title,
      subtitle: [
        price != null ? `R$ ${price.toLocaleString("pt-BR")}` : "Sem preço",
        stock ? "Em estoque" : "Sob encomenda",
        active === false ? "Oculta" : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});

export const schemaTypes = [peca];
