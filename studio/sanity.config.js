import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { categories, schemaTypes } from "./schemas/peca.js";
import { cupomDesconto } from "./schemas/cupom.js";

// Painel do catálogo do "Monte seu PC" (site em ../src/pages/PcBuilder.jsx).
// Cada etapa do montador tem a sua lista; o botão "+" já cria a peça na categoria certa.
export default defineConfig({
  name: "capucho",
  title: "Capucho · Catálogo",
  projectId: "9in9aaz1",
  dataset: "production",
  plugins: [
    structureTool({
      title: "Catálogo",
      structure: (S) =>
        S.list()
          .title("Peças do Monte seu PC")
          .items(
            [S.listItem().id("cupom-desconto").title("Cupom de desconto").child(S.document().schemaType("cupomDesconto").documentId("cupom-desconto").title("Cupom de desconto")), S.divider(), ...categories.map(({ value, title }) =>
              S.listItem()
                .id(value)
                .title(title)
                .child(
                  S.documentTypeList("peca")
                    .title(title)
                    .filter("_type == 'peca' && category == $category")
                    .params({ category: value })
                    .defaultOrdering([{ field: "price", direction: "asc" }])
                    .initialValueTemplates([
                      S.initialValueTemplateItem("peca-por-categoria", { category: value }),
                    ]),
                ),
            )],
          ),
    }),
  ],
  schema: {
    types: [...schemaTypes, cupomDesconto],
    templates: (prev) => [
      ...prev.filter(template => template.schemaType !== "cupomDesconto"),
      {
        id: "peca-por-categoria",
        title: "Peça",
        schemaType: "peca",
        parameters: [{ name: "category", type: "string" }],
        value: ({ category }) => ({ category, stock: false }),
      },
    ],
  },
  document: {
    actions: (prev, context) => context.schemaType === "cupomDesconto" ? prev.filter(action => !["duplicate", "delete"].includes(action.action)) : prev,
  },
});
