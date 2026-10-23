import { defineField, defineType } from "sanity";
import { couponErrors } from "../../shared/coupon.js";
const validation = field => rule => rule.custom((value, { document }) => couponErrors({ ...document, [field]: value })[field] || true);
export const cupomDesconto = defineType({
  name: "cupomDesconto", title: "Cupom de desconto", type: "document",
  initialValue: { active: false },
  fields: [
    defineField({ name: "active", title: "Cupom ativo", type: "boolean", initialValue: false, description: "Preencha os campos e publique para divulgar. Desative e publique para encerrar a oferta." }),
    defineField({ name: "code", title: "Código do cupom", type: "string", description: "O desconto vem dos campos abaixo, não do nome do código.", validation: validation("code") }),
    defineField({ name: "discountType", title: "Tipo de desconto", type: "string", options: { list: [{ title: "Porcentagem (%)", value: "percentage" }, { title: "Valor fixo em reais (R$)", value: "fixed" }], layout: "radio" }, validation: validation("discountType") }),
    defineField({ name: "value", title: "Valor do desconto", type: "number", description: "Percentual até 100 ou valor em reais com até duas casas decimais.", validation: validation("value") }),
  ],
  preview: { select: { active: "active", code: "code" }, prepare: ({ active, code }) => ({ title: "Cupom de desconto", subtitle: active ? `Ativo · ${code || "Preencha o código"}` : "Desativado" }) },
});
