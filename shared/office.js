import { cents } from './coupon.js';

export const officeSteps = [['cpu', 'Processador'], ['board', 'Placa-mãe'], ['ram', 'Memória RAM'], ['storage', 'SSD']];
export const refId = value => typeof value === 'string' ? value : value?._ref;
export const refs = values => (values || []).map(refId);
export const priced = value => { try { return typeof value === 'number' && cents(value) > 0; } catch { return false; } };
export const available = doc => Boolean(doc && !doc._id?.startsWith('drafts.') && doc.active === true && priced(doc.price) && (doc.demonstration === true || (doc.stock === true && doc.revisao === 'ok')));
export const officePart = doc => doc?.office === true;
export function boardIssue(board, cpu, ram, storage) {
  if (!board) return 'Escolha uma placa-mãe.';
  if (board.demonstration === true) return '';
  if (!board.officeVerified || board.socket !== 'LGA1155' || board.memory !== 'DDR3' || !['H61', 'B75'].includes(board.chipset)) return 'Placa-mãe aguardando revisão técnica.';
  if (cpu && (!['i3','i5','i7'].includes(cpu.family) || ![2,3].includes(cpu.generation) || !cpu.igpu || cpu.socket !== board.socket || !board.officeCpuSupport?.some(s => refId(s.cpu) === cpu._id && s.confirmed === true && s.bios?.trim()))) return 'Processador sem suporte e BIOS confirmados nesta placa-mãe.';
  if (ram && (!refs(board.officeRamSupport).includes(ram._id) || ram.memory !== 'DDR3' || ![8, 16].includes(ram.gb) || !(ram.modules > 0 && ram.modules <= board.memSlots) || !(ram.gb <= board.memMax))) return 'Kit de memória não validado para esta placa-mãe.';
  if (storage && (!storage.officeSsd || !refs(board.officeStorageSupport).includes(storage._id) || storage.iface !== 'sata' || storage.storageForm !== '2.5' || !(board.sataPorts > 0))) return 'SSD sem conexão e montagem SATA de 2,5 polegadas confirmadas.';
  return '';
}
export function baseIssue(config, products) {
  if (config?.demonstration === true) return ['case','psu','cooler'].every(key=>products.some(p=>p._id===refId(config[key]) && p.category===key && available(p))) ? '' : 'Preparando os itens da demonstração.';
  if (!config?.active || !config.baseConfirmed || !config.extrasConfirmed || !config.includedNotes?.trim() || !config.approvalNotes?.trim()) return 'A configuração está em preparação pela Capucho.';
  for (const key of ['case', 'psu', 'cooler']) {
    const part = products.find(p => p._id === refId(config[key]));
    if (!available(part) || !officePart(part) || part.category !== key) return 'Os componentes inclusos ainda não estão disponíveis.';
  }
  const chassis = products.find(p => p._id === refId(config.case));
  const psu = products.find(p => p._id === refId(config.psu));
  const cooler = products.find(p => p._id === refId(config.cooler));
  if (chassis.officeModel !== 'GB1752' || !chassis.forms?.includes('mATX') || !chassis.psuForms?.includes(psu.psuForm) || !cooler.sockets?.includes('LGA1155') || !(cooler.height > 0 && cooler.height <= chassis.maxCooler) || !(config.requiredWatts > 0 && psu.watts >= config.requiredWatts)) return 'Fonte, refrigeração ou gabinete aguardando conferência.';
  if ((config.extras || []).some(e => !e.name?.trim() || !Number.isFinite(e.price) || e.price < 0)) return 'Há componentes inclusos sem preço confirmado.';
  return '';
}
export function assemblyIssue(config, products, pick) {
  const base = baseIssue(config, products); if (base) return base;
  const selected = Object.fromEntries(officeSteps.map(([step]) => [step, products.find(p => p._id === pick[step])]));
  for (const [step, label] of officeSteps) {
    const part = selected[step];
    if (!available(part) || part.category !== step || (step !== 'storage' && !officePart(part))) return `Escolha ${label.toLowerCase()} disponível.`;
  }
  const { board, cpu, ram, storage } = selected;
  if (config.demonstration === true) return '';
  if (Object.values(selected).some(p=>p.demonstration === true)) return 'Itens de demonstração não podem compor um pedido real.';
  const chassis = products.find(p => p._id === refId(config.case));
  if (!chassis.forms?.includes(board.form)) return 'Placa-mãe não cabe no gabinete.';
  if (!refs(config.boards).includes(board._id)) return 'Placa-mãe não aprovada para esta montagem.';
  const issue = boardIssue(board, cpu, ram, storage); if (issue) return issue;
  const cooler = products.find(p => p._id === refId(config.cooler));
  if (!(cpu.tdp > 0 && cpu.tdp <= cooler.maxTdp)) return 'Refrigeração insuficiente para o processador.';
  return '';
}
export function miniIssue(config, family) {
  const variant = config?.variants?.find(v => v.family === family);
  if(config?.demonstration === true) return ['i3','i5','i7'].includes(family) && priced(variant?.price) ? '' : 'Versão de demonstração em preparação.';
  if (!config?.active || !config.fixedConfirmed || !config.name?.trim() || !config.memory?.trim() || !config.storage?.trim() || !config.specs?.trim()) return 'Mini PC em preparação pela Capucho.';
  if (config.variants?.filter(v => v.family === family).length !== 1 || !['i3','i5','i7'].includes(family) || !variant?.active || !variant.stock || !variant.confirmed || !variant.model?.trim() || !priced(variant.price)) return 'Esta versão ainda não está disponível.';
  return '';
}
