export function officeFixture() {
 const ref=id=>({_ref:id});
 const part=(category,fields)=>({_id:category,_type:'peca',category,name:`${category} de teste`,price:100,active:true,stock:true,revisao:'ok',office:true,...fields});
 return {
  config:{_id:'pc-office',_rev:'base1',active:true,case:ref('case'),psu:ref('psu'),cooler:ref('cooler'),boards:[ref('board')],requiredWatts:250,baseConfirmed:true,extrasConfirmed:true,approvalNotes:'Aprovação técnica de teste',includedNotes:'Cabos e ventilação inclusos',extras:[{name:'Cabos de teste',price:5.25}]},
  products:[
   part('cpu',{family:'i3',generation:3,name:'Intel Core i3-3220',socket:'LGA1155',igpu:true,tdp:55}),
   part('board',{socket:'LGA1155',memory:'DDR3',form:'mATX',chipset:'H61',memSlots:2,memMax:16,sataPorts:2,officeVerified:true,officeCpuSupport:[{cpu:ref('cpu'),bios:'BIOS TESTE 1',confirmed:true}],officeRamSupport:[ref('ram')],officeStorageSupport:[ref('storage')]}),
   part('ram',{name:'8 GB DDR3 de teste',memory:'DDR3',gb:8,modules:2}),
   part('storage',{name:'SSD de teste',office:false,officeSsd:true,iface:'sata',storageForm:'2.5',price:125.99}),
   part('case',{name:'Hayom GB1752',officeModel:'GB1752',forms:['mATX','mITX'],psuForms:['ATX'],maxCooler:95}),
   part('psu',{watts:300,psuForm:'ATX'}),
   part('cooler',{sockets:['LGA1155'],height:70,maxTdp:95}),
  ],
  mini:{_id:'mini-pc-office',_rev:'mini1',active:true,fixedConfirmed:true,name:'Mini PC de teste',memory:'8 GB de RAM',storage:'SSD de 256 GB',specs:'Fonte e configuração de teste inclusas',variants:['i3','i5','i7'].map((family,i)=>({family,model:`Modelo ${family} confirmado para teste`,active:true,stock:true,confirmed:true,price:1000+i*100}))},
 };
}
export const officeRequest=()=>({kind:'office',selections:['cpu','board','ram','storage'].map(step=>({step,productId:step}))});
