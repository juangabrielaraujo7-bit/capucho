import test from 'node:test';
import assert from 'node:assert/strict';
import { createOfficeQuote, getOfficeCatalog } from '../server/office.js';
import { assemblyIssue, baseIssue, boardIssue, miniIssue } from '../shared/office.js';
import { officeFixture, officeRequest } from './office-fixture.js';
const query=(catalog,coupon=null)=>async()=>({catalog,coupon});
const percent={active:true,code:'OFFICE999',discountType:'percentage',value:10,_rev:'a'};
test('montagem soma as quatro escolhas, gabinete, fonte, cooler e extras em centavos',async()=>{
 const data=officeFixture();const {quote,whatsappUrl}=await createOfficeQuote({...officeRequest(),subtotalCents:1,discountCents:1},query(data));
 assert.equal(quote.subtotalCents,73124);assert.equal(quote.totalCents,73124);assert.equal(quote.items.length,8);assert.ok(whatsappUrl.startsWith('https://wa.me/5511947009632?text='));
 const message=decodeURIComponent(whatsappUrl.split('text=')[1]);for(const text of ['PC Office','Fonte inclusa','Cooler incluso','BIOS TESTE 1','Cabos de teste','731,24','confirmados pela Capucho'])assert.ok(message.includes(text),text);
});
test('percentual normaliza código e usa configuração, não o sufixo',async()=>{
 const {quote}=await createOfficeQuote({...officeRequest(),code:' office999 '},query(officeFixture(),percent));assert.equal(quote.discountCents,7312);assert.equal(quote.totalCents,65812);
});
test('fixo limita desconto ao subtotal; remover restaura valores',async()=>{
 const fixture=officeFixture();const coupon={...percent,discountType:'fixed',value:9000};
 assert.equal((await createOfficeQuote({...officeRequest(),code:'office999'},query(fixture,coupon))).quote.totalCents,0);
 assert.equal((await createOfficeQuote(officeRequest(),query(fixture,coupon))).quote.discountCents,0);
});
test('cupom inválido ou desativado nunca prepara envio com desconto',async()=>{
 for(const coupon of [null,{...percent,active:false}]){const result=await createOfficeQuote({...officeRequest(),code:'office999'},query(officeFixture(),coupon));assert.equal(result.invalidCoupon,true);assert.equal(result.whatsappUrl,null);assert.equal(result.quote.discountCents,0);}
});
test('alteração de peça, preço, BIOS ou configuração fixa atualiza versão e sinaliza revisão',async()=>{
 const data=officeFixture();const publicData=await getOfficeCatalog(async()=>data);const request={...officeRequest(),catalogRevision:publicData.revisions.office};
 const before=await createOfficeQuote(request,query(data));assert.equal(before.catalogChanged,false);
 data.products[0].price=120;const after=await createOfficeQuote(request,query(data));assert.equal(after.catalogChanged,true);assert.notEqual(before.quote.version,after.quote.version);assert.equal(after.quote.subtotalCents,before.quote.subtotalCents+2000);
 data.products[1].officeCpuSupport[0].bios='BIOS TESTE 2';assert.notEqual((await createOfficeQuote(request,query(data))).quote.version,after.quote.version);
 const miniBefore=await createOfficeQuote({kind:'mini',family:'i3'},query(data));data.mini.specs='Nova fonte de teste';assert.notEqual((await createOfficeQuote({kind:'mini',family:'i3'},query(data))).quote.version,miniBefore.quote.version);
});
test('o mesmo SSD é referenciado sem duplicação e sem precisar ser exclusivo do Office',async()=>{
 assert.equal(officeFixture().products.find(p=>p.category==='storage').office,false);assert.ok((await createOfficeQuote(officeRequest(),query(officeFixture()))).quote.totalCents>0);
});
for(const [label,edit] of [
 ['CPU sem BIOS',d=>d.products[1].officeCpuSupport[0].bios=''],
 ['CPU não aprovada',d=>d.products[1].officeCpuSupport[0].confirmed=false],
 ['mesmo soquete sem suporte explícito',d=>d.products[1].officeCpuSupport=[]],
 ['placa sem aprovação',d=>d.products[1].officeVerified=false],
 ['placa maior que gabinete',d=>d.products[1].form='ATX'],
 ['DDR4',d=>d.products[2].memory='DDR4'],
 ['memória maior que capacidade',d=>d.products[2].gb=32],
 ['módulos demais',d=>d.products[2].modules=4],
 ['NVMe não compatível',d=>d.products[3].iface='nvme'],
 ['SSD sem revisão',d=>d.products[3].officeSsd=false],
 ['CPU sem vídeo',d=>d.products[0].igpu=false],
 ['fonte insuficiente',d=>d.products[5].watts=150],
 ['cooler alto',d=>d.products[6].height=120],
 ['cooler sem TDP suficiente',d=>d.products[6].maxTdp=30],
 ['itens inclusos não confirmados',d=>d.config.extrasConfirmed=false],
 ['custo faltante',d=>d.config.extras[0].price=undefined],
 ['preço faltante',d=>delete d.products[5].price],
 ['sem estoque',d=>d.products[2].stock=false],
 ['peça desativada',d=>d.products[0].active=false],
 ['rascunho',d=>d.products[0]._id='drafts.cpu'],
 ['área desativada',d=>d.config.active=false],
])test(`bloqueia ${label}`,async()=>{const data=officeFixture();edit(data);await assert.rejects(()=>createOfficeQuote(officeRequest(),query(data)),e=>e.status===400);});
test('recusa pedido incompleto, duplicado, categoria trocada e opção gamer',async()=>{
 for(const request of [{...officeRequest(),selections:[]},{...officeRequest(),selections:Array(4).fill({step:'cpu',productId:'cpu'})},{...officeRequest(),selections:officeRequest().selections.map(s=>s.step==='ram'?{...s,productId:'storage'}:s)},{...officeRequest(),selections:officeRequest().selections.map(s=>({...s,option:'own'}))}])await assert.rejects(()=>createOfficeQuote(request,query(officeFixture())),e=>e.status===400);
});
test('Mini usa só família e configuração fixa com preço próprio, ignorando seleções e total do cliente',async()=>{
 for(const [i,family]of ['i3','i5','i7'].entries()){
 const {quote,whatsappUrl}=await createOfficeQuote({kind:'mini',family,price:1,selections:officeRequest().selections,code:'OFFICE999'},query(officeFixture(),percent));
 assert.equal(quote.items.length,1);assert.equal(quote.subtotalCents,(1000+i*100)*100);assert.equal(quote.discountCents,(1000+i*100)*10);assert.ok(decodeURIComponent(whatsappUrl).includes('8 GB de RAM'));assert.ok(decodeURIComponent(whatsappUrl).includes('SSD de 256 GB'));
 }
});
test('Mini sem modelo exato, confirmação, preço, estoque ou versão liberada não pode finalizar',async()=>{
 for(const edit of [d=>d.mini.variants[0].model='',d=>d.mini.variants[0].confirmed=false,d=>d.mini.variants[0].price=null,d=>d.mini.variants[0].stock=false,d=>d.mini.fixedConfirmed=false,d=>d.mini.variants.push(d.mini.variants[0])]){const data=officeFixture();edit(data);await assert.rejects(()=>createOfficeQuote({kind:'mini',family:'i3'},query(data)),e=>e.status===400);}
 await assert.rejects(()=>createOfficeQuote({kind:'mini',family:'i9'},query(officeFixture())),e=>e.status===400);
});
test('falha do Sanity não autoriza orçamento',async()=>{await assert.rejects(()=>createOfficeQuote(officeRequest(),async()=>{throw new Error('offline');}));await assert.rejects(()=>getOfficeCatalog(async()=>null));});
test('catálogo público remove dados internos e peças incompletas',async()=>{
 const data=officeFixture();data.products[0].fornecedor={private:'interno'};data.products.push({...data.products[0],_id:'sem-preco',price:null});
 const result=await getOfficeCatalog(async()=>data);assert.equal(result.products.length,7);assert.equal(result.products[0].fornecedor,undefined);assert.equal(result.config.approvalNotes,'Conferido pela Capucho');assert.ok(result.products[3].officeSsd);
 assert.equal(assemblyIssue(result.config,result.products,Object.fromEntries(officeRequest().selections.map(s=>[s.step,s.productId]))),'');
});
