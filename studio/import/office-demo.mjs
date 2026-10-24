// User-authorized illustrative catalog. Does not invent commercial stock, prices,
// BIOS approvals or exact Mini CPU models. Disable demonstration to return to real gates.
import {getCliClient} from 'sanity/cli';
import {readFile} from 'node:fs/promises';
const client=getCliClient({apiVersion:'2025-02-19'});
const raw=await client.fetch('*[_type in ["peca","officeConfig","officeMini"]]',{}, {perspective:'raw'});
const imageCache=new Map();
async function image(file){
 if(imageCache.has(file))return imageCache.get(file);
 const filename=file.split('/').pop();
 let doc=await client.fetch('*[_type == "sanity.imageAsset" && originalFilename == $filename][0]',{filename},{perspective:'raw'});
 if(!doc)doc=await client.assets.upload('image',await readFile(new URL(`../../public/assets/${file}`,import.meta.url)),{filename});
 const value={_type:'image',asset:{_type:'reference',_ref:doc._id}};imageCache.set(file,value);return value;
}
const clean=doc=>Object.fromEntries(Object.entries(doc).filter(([key])=>!['_rev','_createdAt','_updatedAt'].includes(key)));
const updates=[];
function source(id){return raw.find(p=>p._id===`drafts.${id}`)||raw.find(p=>p._id===id);}
async function queue(id,fields){
 const original=source(id);if(!original)throw new Error(`Cadastro ausente: ${id}`);
 const doc={...clean(original),_id:id,...fields};
 updates.push({doc,original});
}
for(const id of new Set(raw.filter(p=>/^(drafts\.)?office-cpu-/.test(p._id)).map(p=>p._id.replace(/^drafts\./,'')))){
 const doc=source(id);
 const prices={i3:89,i5:159,i7:279};const model=doc.name.match(/-(\d+)/)?.[1]||'0';
 await queue(id,{officeDemoPrice:prices[doc.family]+(doc.generation===3?30:0)+(Number(model.slice(-2))>=40?20:0),image:await image('office/cpu-illustrative.webp'),specs:`${doc.generation}ª geração · LGA 1155 · imagem ilustrativa`});
}
for(const [id,price]of [['office-board-h61',219],['office-board-b75',279]])await queue(id,{officeDemoPrice:price,image:await image('office/board-illustrative.webp'),specs:'DDR3 · LGA 1155 · modelo e BIOS a confirmar'});
for(const [id,price]of [['office-ram-8',89],['office-ram-16',159]])await queue(id,{officeDemoPrice:price,image:await image('office/ram-illustrative.webp'),specs:'DDR3 · módulos e frequência a confirmar'});
await queue('office-case-gb1752',{officeDemoPrice:129});
const storage=[];
for(const [sku,price]of [['182587014',119],['182582643',179],['182588022',219]]){
 const doc=raw.find(p=>p._id===`ciapc-${sku}`);
 if(!doc || doc.category!=='storage' || doc.iface!=='sata')throw new Error(`SSD existente ausente: ${sku}`);
 // Patch only Office's provisional price and existing product photo, never its
 // commercial price, availability or Gamer-facing specifications.
 const photo=doc.image||await image(`catalogo/${sku}.webp`);
 updates.push({storage:true,doc:{_id:doc._id,officeDemoPrice:price,image:photo}});storage.push(doc._id);
}
for(const [id,category,name,price]of [['office-demo-psu','psu','Fonte para PC Office · modelo a confirmar',149],['office-demo-cooler','cooler','Cooler para PC Office · modelo a confirmar',49]]){
 updates.push({doc:{_id:id,_type:'peca',category,name,office:true,officeOnly:true,active:false,stock:false,revisao:'pendente',officeDemoPrice:price,specs:'Componente ilustrativo; modelo final a confirmar'}});
}
const ref=id=>({_type:'reference',_ref:id});
await queue('pc-office',{demonstration:true,case:ref('office-case-gb1752'),psu:ref('office-demo-psu'),cooler:ref('office-demo-cooler'),boards:['office-board-h61','office-board-b75'].map((id,i)=>({...ref(id),_key:`board${i}`})),includedNotes:'Componentes e valores ilustrativos. Montagem, ventilação e cabos serão definidos no orçamento real.'});
const mini=source('mini-pc-office');
await queue('mini-pc-office',{demonstration:true,specs:'Configuração de referência: 8 GB de RAM e SSD de 256 GB. Modelo exato do processador e demais itens serão confirmados pela Capucho.',variants:mini.variants.map((v,i)=>({...v,model:v.model||'Modelo a confirmar',officeDemoPrice:[899,1199,1499][i]}))});
// One atomic transaction prevents a half-populated public demo. Revision guards
// protect any draft changed by the owner while this preparation was running.
let tx=client.transaction();
for(const {doc,original,storage:isStorage}of updates){
 if(isStorage){tx=tx.patch(doc._id,{set:{officeDemoPrice:doc.officeDemoPrice},setIfMissing:{image:doc.image}});continue;}
 const published=raw.find(p=>p._id===doc._id);
 if(published)tx=tx.patch(doc._id,{ifRevisionID:published._rev,set:Object.fromEntries(Object.entries(clean(doc)).filter(([key])=>!['_id','_type'].includes(key)))});
 else tx=tx.create(doc);
 if(original?._id.startsWith('drafts.'))tx=tx.patch(original._id,{ifRevisionID:original._rev,set:{officeDemoPrice:doc.officeDemoPrice||0}}).delete(original._id);
}
await tx.commit();
console.log(JSON.stringify({publishedDemonstration:updates.length,cpus:21,boards:2,ram:2,reusedStorage:storage,commercialPricesUnchanged:true,stockAndApprovalsUnchanged:true}));
