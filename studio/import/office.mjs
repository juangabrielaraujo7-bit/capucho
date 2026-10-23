// Run with: npx sanity exec import/office.mjs --with-user-token
// Only creates missing drafts. Never publishes, overwrites or invents prices/stock.
import { getCliClient } from 'sanity/cli';
import { readFile } from 'node:fs/promises';
const client=getCliClient({apiVersion:'2025-02-19'});
const cpuModels={i3:{2:['2100','2120','2130'],3:['3220','3240','3250']},i5:{2:['2300','2310','2320','2400','2500'],3:['3330','3340','3450','3470','3570']},i7:{2:['2600','2600K','2700K'],3:['3770','3770K']}};
const draft=(id,fields)=>({_id:`drafts.${id}`,_type:'peca',active:false,stock:false,revisao:'pendente',office:true,officeOnly:true,...fields});
const docs=[];
for(const [family,generations]of Object.entries(cpuModels))for(const [generation,models]of Object.entries(generations))for(const model of models)docs.push(draft(`office-cpu-${family}-${model.toLowerCase()}`,{category:'cpu',name:`Intel Core ${family}-${model}`,brand:'Intel',family,generation:Number(generation),socket:'LGA1155',specs:`${generation}ª geração · compatibilidade e BIOS a confirmar`}));
for(const chipset of ['H61','B75'])docs.push(draft(`office-board-${chipset.toLowerCase()}`,{category:'board',name:`${chipset} DDR3`,brand:'Intel',socket:'LGA1155',memory:'DDR3',chipset,specs:'Modelo, revisão e BIOS a confirmar'}));
for(const gb of [8,16])docs.push(draft(`office-ram-${gb}`,{category:'ram',name:`${gb} GB DDR3`,memory:'DDR3',gb,specs:'Marca, módulos e frequência a confirmar'}));
docs.push(draft('office-case-gb1752',{category:'case',name:'Hayom Office GB1752, preto, Micro-ATX',officeModel:'GB1752',forms:['mATX','mITX'],psuForms:['ATX'],maxCooler:95,specs:'Gabinete compacto · fonte e ventoinhas não inclusas na peça'}));
docs.push({_id:'drafts.pc-office',_type:'officeConfig',active:false,baseConfirmed:false,extrasConfirmed:false,case:{_type:'reference',_ref:'office-case-gb1752',_weak:true}});
docs.push({_id:'drafts.mini-pc-office',_type:'officeMini',name:'Mini PC Office',active:false,memory:'8 GB de RAM',storage:'SSD de 256 GB',fixedConfirmed:false,variants:['i3','i5','i7'].map(family=>({_key:family,_type:'object',family,active:false,stock:false,confirmed:false}))});
let created=0,skipped=0;
for(const doc of docs){const published=doc._id.slice(7);const existing=await client.fetch('*[_id in $ids][0]._id',{ids:[doc._id,published]},{perspective:'raw'});if(existing){skipped++;continue;}if(['drafts.office-case-gb1752','drafts.mini-pc-office'].includes(doc._id)){const file=doc._id==='drafts.mini-pc-office'?'mini-pcyes':'hayom-gb1752';const image=await client.assets.upload('image',await readFile(new URL(`../../public/assets/office/${file}.webp`,import.meta.url)),{filename:`${file}.webp`});doc.image={_type:'image',asset:{_type:'reference',_ref:image._id}};}await client.createIfNotExists(doc);created++;}
console.log(`PC Office: ${created} rascunhos criados; ${skipped} cadastros preservados. Nada publicado.`);
