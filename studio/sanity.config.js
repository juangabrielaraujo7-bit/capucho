import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { categories, schemaTypes } from "./schemas/peca.js";
import { cupomDesconto } from "./schemas/cupom.js";
import { officeConfig, officeMini } from './schemas/office.js';

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
            [S.listItem().id('office').title('PC Office').child(S.list().title('PC Office').items([
              S.listItem().id('pc-office').title('Montagem · itens inclusos e liberação').child(S.document().schemaType('officeConfig').documentId('pc-office')),
              S.listItem().id('mini-pc-office').title('Mini PC · versões e preços').child(S.document().schemaType('officeMini').documentId('mini-pc-office')),
              ...categories.filter(c=>c.value !== 'gpu').map(c=>S.listItem().id(`office-${c.value}`).title(c.title).child(S.documentTypeList('peca').title(c.title).filter('_type == "peca" && category == $category && (office == true || category == "storage")').params({category:c.value}).initialValueTemplates([S.initialValueTemplateItem('peca-office',{category:c.value})])))
            ])), S.divider(), S.listItem().id("cupom-desconto").title("Cupom de desconto").child(S.document().schemaType("cupomDesconto").documentId("cupom-desconto").title("Cupom de desconto")), S.divider(), ...categories.map(({ value, title }) =>
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
    types: [...schemaTypes, cupomDesconto, officeConfig, officeMini],
    templates: (prev) => [
      ...prev.filter(template => !['cupomDesconto','officeConfig','officeMini'].includes(template.schemaType)),
      {id:'peca-office',title:'Peça Office',schemaType:'peca',parameters:[{name:'category',type:'string'}],value:({category})=>({category,office:true,officeOnly:category!=='storage',active:false,stock:false,revisao:'pendente'})},
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
    actions: (prev, context) => ['cupomDesconto','officeConfig','officeMini'].includes(context.schemaType) ? prev.filter(action => !["duplicate", "delete"].includes(action.action)) : prev,
  },
});
