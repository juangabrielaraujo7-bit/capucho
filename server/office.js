import { createHash } from 'node:crypto';
import { sanityQuery, couponProjection } from './sanity.js';
import { benefit, cents, discountInCents, money, normalizeCode, publishedCoupon } from '../shared/coupon.js';
import { officeSteps, refId, assemblyIssue, miniIssue, available } from '../shared/office.js';
import { OrderError } from './quote.js';
import { wa } from '../src/config.js';

export const officeProjection = `{"config":*[_id == "pc-office" && _type == "officeConfig"][0],"mini":*[_id == "mini-pc-office" && _type == "officeMini"][0]{...,"imageUrl":image.asset->url},"products":*[_type == "peca" && (office == true || category == "storage") && active == true && stock == true && revisao == "ok"]{...,"imageUrl":image.asset->url}}`;
const revision = (data, kind) => createHash('sha256').update(JSON.stringify(kind === 'mini' ? data.mini : {config:data.config,products:data.products})).digest('hex');
export async function getOfficeCatalog(query = sanityQuery) {
  const data = await query(officeProjection);
  if (!data || !Array.isArray(data.products)) throw new Error('Catálogo indisponível');
  // Explicit public projection: supplier notes and internal approval text never leave the server.
  const keys = ['_id','category','name','specs','price','active','stock','revisao','office','officeSsd','family','generation','socket','memory','form','gb','modules','memSlots','memMax','sataPorts','chipset','igpu','tdp','forms','psuForms','psuForm','watts','sockets','height','maxCooler','maxTdp','iface','storageForm','officeModel','officeVerified','officeCpuSupport','officeRamSupport','officeStorageSupport','imageUrl'];
  return { revisions:{office:revision(data,'office'),mini:revision(data,'mini')},config: data.config ? { ...data.config, approvalNotes: data.config.approvalNotes ? 'Conferido pela Capucho' : '' } : null, mini: data.mini, products: data.products.filter(available).map(p => Object.fromEntries(keys.filter(k => p[k] !== undefined).map(k => [k,p[k]]))) };
}
export async function createOfficeQuote(body, query = sanityQuery) {
  if (!body || !['office','mini'].includes(body.kind) || (body.code != null && (typeof body.code !== 'string' || body.code.length > 100))) throw new OrderError('Pedido Office inválido. Revise a configuração.');
  const data = await query(`{"catalog":${officeProjection},"coupon":${couponProjection}}`);
  if (!data?.catalog || !Array.isArray(data.catalog.products)) throw new Error('Catálogo indisponível');
  const { config, mini, products } = data.catalog;
  let items, heading, details = [];
  if (body.kind === 'office') {
    if (!Array.isArray(body.selections) || body.selections.length !== 4 || new Set(body.selections.map(s => s?.step)).size !== 4 || body.selections.some(s => !officeSteps.some(([key]) => key === s?.step) || typeof s.productId !== 'string' || s.option)) throw new OrderError('Selecione os quatro componentes do PC Office.');
    const pick = Object.fromEntries(body.selections.map(s => [s.step,s.productId]));
    const issue = assemblyIssue(config,products,pick); if (issue) throw new OrderError(`${issue} Atualize o catálogo e revise a montagem.`);
    items = [...officeSteps, ['case','Gabinete'], ['psu','Fonte inclusa'], ['cooler','Cooler incluso']].map(([step,label]) => {
      const p = products.find(p => p._id === (pick[step] || refId(config[step])));
      return { step, label, productId:p._id, name:p.name, cents:cents(p.price) };
    });
    items.push(...(config.extras || []).map((e,i) => ({step:`extra${i}`,label:'Incluso',name:e.name,cents:cents(e.price)})));
    const board = products.find(p => p._id === pick.board);
    details = [`BIOS validada: ${board.officeCpuSupport.find(s => refId(s.cpu) === pick.cpu).bios}`, `Também incluso: ${config.includedNotes}`];
    heading = 'Olá, Capucho! Quero um orçamento deste PC Office montado:';
  } else {
    const issue = miniIssue(mini,body.family); if (issue) throw new OrderError(`${issue} Atualize o catálogo.`);
    const variant = mini.variants.find(v => v.family === body.family);
    items = [{step:'mini',label:'Mini PC',productId:`${mini._id}-${body.family}`,name:`${mini.name} · Intel Core ${body.family} · ${variant.model}`,cents:cents(variant.price)}];
    details = [`Memória: ${mini.memory}`, `Armazenamento: ${mini.storage}`, `Configuração fixa: ${mini.specs}`];
    heading = 'Olá, Capucho! Quero um orçamento deste Mini PC Office:';
  }
  const subtotalCents = items.reduce((sum,i) => sum+i.cents,0);
  if (!Number.isSafeInteger(subtotalCents)) throw new Error('Total fora do limite');
  const offer = publishedCoupon(data.coupon), code = normalizeCode(body.code);
  const invalidCoupon = Boolean(code && (!offer || code !== offer.code));
  const coupon = code && !invalidCoupon ? offer : null;
  const discountCents = discountInCents(subtotalCents,coupon), totalCents = subtotalCents-discountCents;
  const version = createHash('sha256').update(JSON.stringify({items,details,coupon,subtotalCents,discountCents,totalCents, configRevision:body.kind === 'office' ? config._rev : mini._rev})).digest('hex');
  const quote = {items,details,subtotalCents,discountCents,totalCents,coupon,version,partial:false};
  const lines = [heading,'',...items.map(i=>`• ${i.label}: ${i.name} — ${money(i.cents)}`),...details,'',`Subtotal dos produtos: ${money(subtotalCents)}`,coupon ? `Cupom aplicado: ${coupon.code}` : 'Cupom: não aplicado',...(coupon ? [`Benefício: ${coupon.discountType === 'percentage' ? 'Porcentagem' : 'Valor fixo'} — ${benefit(coupon)}`] : []),`Desconto do cupom: ${money(discountCents)}`,`Total estimado${coupon ? ' com desconto' : ''}: ${money(totalCents)}`,'Frete e serviços cobrados separadamente não entram no desconto.','Disponibilidade, valores, prazo e orçamento são confirmados pela Capucho.'];
  return {quote,invalidCoupon,catalogChanged:Boolean(body.catalogRevision && body.catalogRevision !== revision(data.catalog,body.kind)),whatsappUrl:invalidCoupon ? null : wa(lines.join('\n'))};
}
