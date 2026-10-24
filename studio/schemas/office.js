import { defineField, defineType } from 'sanity';

const reference = (name,title,category) => defineField({name,title,type:'reference',to:[{type:'peca'}],options:{filter:'category == $category',filterParams:{category}}});
const positive = rule => rule.custom(v => v == null || (Number.isFinite(v) && v > 0 && Math.abs(v*100-Math.round(v*100)) < 0.000001) ? true : 'Informe um valor positivo com até duas casas decimais.');
export const officeConfig = defineType({
  name:'officeConfig', title:'Monte seu PC Office', type:'document',
  initialValue:{active:false,baseConfirmed:false,extrasConfirmed:false},
  fields:[
    defineField({name:'demonstration',title:'Exibir demonstração com preços fictícios',type:'boolean',description:'Mostra fotos ilustrativas e Preço de demonstração das peças. Não altera preço comercial nem confirma estoque/compatibilidade. Desative após cadastrar os dados reais.'}),
    defineField({name:'active',title:'Liberar configurações no site',type:'boolean',description:'Só ative após conferir preços, estoque, BIOS, fonte, cooler, cabos e ventilação.'}),
    reference('case','Gabinete único · Hayom GB1752','case'),
    reference('psu','Fonte inclusa (preço somado ao pedido)','psu'),
    reference('cooler','Cooler incluso (preço somado ao pedido)','cooler'),
    defineField({name:'boards',title:'Placas-mãe aprovadas nesta montagem',type:'array',of:[{type:'reference',to:[{type:'peca'}],options:{filter:'category == "board" && office == true'}}],validation:r=>r.unique()}),
    defineField({name:'requiredWatts',title:'Potência mínima da fonte para o conjunto (W)',type:'number',description:'Definida pelo técnico considerando a pior combinação liberada.',validation:r=>r.positive()}),
    defineField({name:'extras',title:'Demais componentes inclusos',description:'Ventoinhas, cabos e adaptadores necessários. Valor zero somente quando o custo já está embutido em outra peça.',type:'array',of:[{type:'object',fields:[{name:'name',title:'Componente / conjunto',type:'string',validation:r=>r.required()},{name:'price',title:'Preço (R$)',type:'number',validation:r=>r.required().min(0)}]}]}),
    defineField({name:'includedNotes',title:'O que acompanha a montagem',type:'text',rows:3,description:'Texto público com os demais itens e custos já inclusos.'}),
    defineField({name:'extrasConfirmed',title:'Todos os itens e custos necessários estão considerados',type:'boolean'}),
    defineField({name:'baseConfirmed',title:'Conjunto completo validado tecnicamente',type:'boolean',description:'Confirme encaixe, conectores, ventilação, alimentação, vídeo integrado e todas as combinações de placas/CPU/RAM/SSD liberadas.'}),
    defineField({name:'approvalNotes',title:'Registro interno da aprovação técnica',type:'text',description:'Responsável, data e critérios da validação. Não é exibido ao visitante.'}),
  ],
  validation:r=>r.custom(d=> !d?.active || (d.case?._ref && d.psu?._ref && d.cooler?._ref && d.boards?.length && d.requiredWatts>0 && d.baseConfirmed && d.extrasConfirmed && d.includedNotes?.trim() && d.approvalNotes?.trim()) ? true : 'Complete e aprove o conjunto antes de ativar. Peças, preços, estoque e compatibilidade também são conferidos pelo servidor.'),
  preview:{prepare:()=>({title:'Monte seu PC Office'})},
});
export const officeMini = defineType({
  name:'officeMini',title:'Mini PC Office',type:'document',
  initialValue:{active:false,name:'Mini PC Office',memory:'8 GB de RAM',storage:'SSD de 256 GB',fixedConfirmed:false,variants:['i3','i5','i7'].map(family=>({_key:family,family,active:false,stock:false,confirmed:false}))},
  fields:[
    defineField({name:'demonstration',title:'Exibir demonstração com preços fictícios',type:'boolean',description:'Usa os preços de demonstração de cada versão e informa que modelos e orçamento são provisórios.'}),
    defineField({name:'active',title:'Mostrar Mini PC no site',type:'boolean'}),
    defineField({name:'name',title:'Nome do produto',type:'string'}),
    defineField({name:'image',title:'Imagem',type:'image'}),
    defineField({name:'memory',title:'Memória (igual nas três versões)',type:'string'}),
    defineField({name:'storage',title:'Armazenamento (igual nas três versões)',type:'string'}),
    defineField({name:'specs',title:'Configuração fixa e itens inclusos',type:'text',rows:4,description:'Modelo do Mini PC, conectividade, sistema, fonte e demais itens confirmados. Não reutilize os processadores do montador automaticamente.'}),
    defineField({name:'fixedConfirmed',title:'Configuração fixa e compatibilidade confirmadas',type:'boolean'}),
    defineField({name:'variants',title:'Versões (somente i3, i5 e i7)',type:'array',validation:r=>r.length(3).custom(v=>new Set((v||[]).map(x=>x.family)).size === 3 ? true : 'Cadastre uma versão de cada família: i3, i5 e i7.'),of:[{type:'object',fields:[
      {name:'family',title:'Família',type:'string',options:{list:['i3','i5','i7']},validation:r=>r.required()},
      {name:'model',title:'Modelo exato do processador',type:'string'},
      {name:'price',title:'Preço completo desta versão (R$)',type:'number',validation:positive},
      {name:'officeDemoPrice',title:'Preço fictício de demonstração (R$)',type:'number',validation:positive},
      {name:'stock',title:'Disponível em estoque',type:'boolean'},
      {name:'active',title:'Liberar esta versão',type:'boolean'},
      {name:'confirmed',title:'Modelo e compatibilidade confirmados neste Mini PC',type:'boolean'},
    ],validation:r=>r.custom(v=>!v?.active || (v.model?.trim() && v.confirmed && v.price>0) ? true : 'Informe modelo exato, preço e confirmação para liberar a versão.'),preview:{select:{title:'family',subtitle:'model'},prepare:({title,subtitle})=>({title:`Intel Core ${title || ''}`,subtitle})}}]}),
  ],
  validation:r=>r.custom(d=>!d?.active || (d.fixedConfirmed && d.name?.trim() && d.memory?.trim() && d.storage?.trim() && d.specs?.trim()) ? true : 'Confirme o nome e a configuração fixa antes de ativar. As versões sem estoque continuam indisponíveis para compra.'),
  preview:{prepare:()=>({title:'Mini PC Office · i3 / i5 / i7'})},
});

export const officeFields = [
  defineField({name:'officeDemoPrice',title:'Preço fictício de demonstração Office (R$)',type:'number',description:'Separado do preço comercial. Só é exibido no Office enquanto o modo de demonstração estiver ligado.',validation:positive}),
  defineField({name:'officeSsd',title:'SSD validado para uso no Office',description:'Marque no SSD já existente, sem duplicá-lo. Confirme SATA, formato 2.5 e a lista de suporte da placa-mãe.',type:'boolean',hidden:({parent})=>parent?.category!=='storage'}),
  defineField({name:'office',title:'Usar no PC Office',type:'boolean',initialValue:false}),
  defineField({name:'officeOnly',title:'Exclusiva do Office (ocultar no Gamer)',type:'boolean',initialValue:false}),
  defineField({name:'family',title:'Família Intel Office',type:'string',options:{list:['i3','i5','i7']},hidden:({parent})=>!parent?.office || parent.category!=='cpu'}),
  defineField({name:'generation',title:'Geração Intel',type:'number',options:{list:[2,3]},hidden:({parent})=>!parent?.office || parent.category!=='cpu'}),
  defineField({name:'officeModel',title:'Modelo do gabinete Office',type:'string',options:{list:['GB1752']},hidden:({parent})=>!parent?.office || parent.category!=='case'}),
  defineField({name:'officeVerified',title:'Placa-mãe Office revisada (modelo, revisão e BIOS)',type:'boolean',hidden:({parent})=>!parent?.office || parent.category!=='board'}),
  defineField({name:'officeCpuSupport',title:'Processadores e BIOS validados',type:'array',hidden:({parent})=>!parent?.office || parent.category!=='board',of:[{type:'object',fields:[
    {name:'cpu',title:'Processador exato',type:'reference',to:[{type:'peca'}],options:{filter:'category == "cpu" && office == true'},validation:r=>r.required()},
    {name:'bios',title:'Versão de BIOS verificada',type:'string',validation:r=>r.required()},
    {name:'confirmed',title:'Suporte confirmado neste modelo/revisão de placa',type:'boolean'},
  ],preview:{select:{title:'cpu.name',subtitle:'bios'}}}]}),
  ...[['officeRamSupport','Kits de memória validados','ram'],['officeStorageSupport','SSDs SATA 2,5” validados (cadastro existente)','storage']].map(([name,title,category])=>defineField({name,title,type:'array',hidden:({parent})=>!parent?.office || parent.category!=='board',of:[{type:'reference',to:[{type:'peca'}],options:{filter:'category == $category',filterParams:{category}}}],validation:r=>r.unique()})),
];
