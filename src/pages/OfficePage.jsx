import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowUpRight, Check, Cpu, DesktopTower, HardDrives, Memory, Circuitry, WhatsappLogo, ArrowClockwise } from '@phosphor-icons/react';
import CouponOffer, { useCouponOffer } from '../components/CouponOffer';
import useOrderQuote from '../useOrderQuote';
import { benefit, cents, money } from '../../shared/coupon.js';
import { available, officeSteps, refId, refs, baseIssue, boardIssue, assemblyIssue, miniIssue } from '../../shared/office.js';
import { asset, wa } from '../config';
import '../office.css';

function ProductImage({src,kind='case',name,hero=false}) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[src]);
  return <img src={!failed && src ? `${src}${src.includes('cdn.sanity.io') ? '?w=600&fit=max&auto=format' : ''}` : asset(`office/${kind==='mini'?'mini-pcyes':'hayom-gb1752'}.webp`)} alt={name} width="600" height="600" loading={hero?'eager':'lazy'} fetchPriority={hero?'high':'auto'} decoding="async" onError={()=>setFailed(true)} />;
}
function Breadcrumb({current}) {return <nav className="office-crumb" aria-label="Navegação estrutural"><Link to="/">Início</Link><span>/</span>{current ? <><Link to="/pc-office">PC Office</Link><span>/</span><span aria-current="page">{current}</span></> : <span aria-current="page">PC Office</span>}</nav>;}
export default function OfficePage(){
  const {offer}=useCouponOffer();
  const {data}=useOfficeCatalog();
  const chassis=data?.products?.find(p=>p._id===refId(data?.config?.case));
  return <div className="office"><div className="container office-wrap"><Breadcrumb/><header className="office-intro"><h1>Seu próximo computador.<br/><span>Pronto para o trabalho.</span></h1><p>Da rotina do escritório ao seu espaço em casa. Escolha as peças do seu PC Office ou conheça a praticidade de um Mini PC.</p></header>
    <div className="office-paths">
      <article><div className="office-product-stage"><ProductImage kind="case" src={chassis?.imageUrl} name="Gabinete Hayom Office GB1752 preto" hero/><span>Peça por peça, do seu jeito</span></div><div className="office-path-copy"><h2>Monte seu PC Office</h2><p>Escolha processador, placa-mãe, memória e SSD. A Capucho cuida da montagem e da conferência do conjunto.</p><Link className="office-button" to="/pc-office/monte-seu-pc">Escolher componentes <ArrowUpRight size={20}/></Link></div></article>
      <article><div className="office-product-stage is-mini"><ProductImage kind="mini" src={data?.mini?.imageUrl} name={data?.mini?.name || 'Mini PC PCYES One B300, referência de formato'}/><span>Um computador completo e compacto</span></div><div className="office-path-copy"><h2>Mini PC Office</h2><p>Uma configuração pronta, com versões Intel Core i3, i5 ou i7. Você escolhe o processador; o restante já vem definido.</p><Link className="office-button is-secondary" to="/pc-office/mini-pc">Conhecer o Mini PC <ArrowUpRight size={20}/></Link></div></article>
    </div><CouponOffer offer={offer}/><p className="office-footnote">Imagens de referência dos gabinetes. Modelos, configuração e disponibilidade são apresentados em cada opção.</p>
    <section className="office-help"><div><h2>Vamos encontrar o PC certo?</h2><p>Conte quais programas você usa e como é a sua rotina.</p></div><a className="office-button is-secondary" href={wa('Olá, Capucho! Preciso de ajuda para escolher um PC Office para o meu trabalho.')} target="_blank" rel="noreferrer">Falar com a Capucho <WhatsappLogo size={21}/></a></section>
  </div></div>;
}

function useOfficeCatalog(){
  const [state,setState]=useState({loading:true,data:null,error:''});
  const ref=useRef(null);
  async function refresh(){
    ref.current?.abort();const controller=new AbortController();ref.current=controller;
    const timeout=setTimeout(()=>controller.abort(),10000);
    try{const response=await fetch('/api/office',{cache:'no-store',signal:controller.signal});const data=await response.json();if(!response.ok || !Array.isArray(data.products))throw new Error();setState({loading:false,data,error:''});}
    catch{if(ref.current===controller)setState({loading:false,data:null,error:'Não foi possível carregar as opções. Tente novamente.'});}
    finally{clearTimeout(timeout);}
  }
  useEffect(()=>{refresh();const focus=()=>{if(document.visibilityState==='visible')refresh();};const timer=setInterval(focus,30000);window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);return()=>{ref.current?.abort();clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus);};},[]);
  return {...state,refresh};
}
const icons={cpu:Cpu,board:Circuitry,ram:Memory,storage:HardDrives};
function Option({product,selected,onClick,reason}){
  const Icon=icons[product.category] || DesktopTower;
  return <button className={`office-option${selected?' is-selected':''}`} type="button" disabled={Boolean(reason)} onClick={onClick} aria-pressed={selected}>
    <span className="office-option-image">{product.imageUrl ? <img src={`${product.imageUrl}?w=240&fit=max&auto=format`} alt="" width="120" height="120" loading="lazy"/> : <Icon size={36} weight="light"/>}</span>
    <span className="office-option-copy"><strong>{product.name}</strong>{product.specs && <small>{product.specs}</small>}<b>{money(cents(product.price))}</b>{reason && <small>{reason}</small>}</span><span className="office-radio" aria-hidden="true">{selected && <Check size={15}/>}</span>
  </button>;
}
function CouponForm({order,disabled}){
  const [input,setInput]=useState('');
  return <form className="office-coupon" onSubmit={e=>{e.preventDefault();order.apply(input);}} aria-busy={order.busy}>
    <label htmlFor="office-coupon-code">Cupom de desconto</label>
    {order.code ? <div key="applied" className="office-applied">
      <span>{order.quote?.coupon ? `${order.code} · ${benefit(order.quote.coupon)}` : `${order.code} · aguardando validação`}</span>
      <button type="button" onClick={event=>{event.preventDefault();order.remove();}} disabled={order.busy}>Remover</button>
    </div> : <div key="entry" className="office-coupon-field">
      <input id="office-coupon-code" value={input} onChange={e=>setInput(e.target.value)} placeholder="Digite o código" autoComplete="off" maxLength={80} disabled={disabled || order.busy}/>
      <button type="submit" disabled={disabled || order.busy}>Aplicar</button>
    </div>}
    <div aria-live="polite" role="status">{(order.error || order.notice || order.busy) && <p className={order.error?'office-error':''}>{order.busy?'Conferindo preços e cupom…':order.error || order.notice}</p>}{order.error && <button type="button" onClick={order.retry} disabled={disabled || order.busy}>Tentar novamente</button>}</div>
  </form>;
}
export function OfficeBuilder({mini=false}){
  const catalog=useOfficeCatalog(),{offer}=useCouponOffer();
  const {products=[],config=null,mini:miniConfig=null}=catalog.data || {};
  const storageKey=mini?'capucho-mini-office':'capucho-office';
  const [pick,setPick]=useState({}),[family,setFamily]=useState('i3'),[cpuFamily,setCpuFamily]=useState('i3');
  const [ready,setReady]=useState(false),[step,setStep]=useState('cpu');
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(mini && ['i3','i5','i7'].includes(saved?.family))setFamily(saved.family);else if(!mini && saved && typeof saved==='object')setPick(saved);}catch{}setReady(true);},[storageKey,mini]);
  useEffect(()=>{if(ready)try{localStorage.setItem(storageKey,JSON.stringify(mini?{family}:pick));}catch{}},[pick,family,ready,storageKey,mini]);
  useEffect(()=>{
    if(mini || !catalog.data || !ready)return;
    setPick(previous=>{
      const next={...previous};
      for(const [key]of officeSteps)if(next[key] && !products.some(p=>p._id===next[key] && p.category===key && available(p)))delete next[key];
      const board=products.find(p=>p._id===next.board);
      if(board){
        if(!refs(config?.boards).includes(board._id))delete next.board;
        for(const key of ['cpu','ram','storage']){
          const p=products.find(p=>p._id===next[key]);
          if(p && boardIssue(board,key==='cpu'?p:null,key==='ram'?p:null,key==='storage'?p:null))delete next[key];
        }
      }
      return JSON.stringify(next)===JSON.stringify(previous)?previous:next;
    });
  },[catalog.data,ready,mini]);
  const issue=catalog.data ? mini?miniIssue(miniConfig,family):assemblyIssue(config,products,pick) : catalog.loading?'Carregando opções…':'O catálogo está indisponível.';
  const base=baseIssue(config,products);
  const current=products.find(p=>p._id===pick.board);
  const selected=products.find(p=>p._id===pick.cpu);
  const variant=miniConfig?.variants?.find(v=>v.family===family);
  const rows=mini ? (!miniIssue(miniConfig,family)?[{step:'mini',label:'Mini PC',productId:`${miniConfig._id}-${family}`,name:`${miniConfig.name} · Intel Core ${family} · ${variant.model}`,cents:cents(variant.price)}]:[]) : [...officeSteps.map(([key,label])=>{const p=products.find(p=>p._id===pick[key]);return {step:key,label,productId:p?._id,name:p?.name||'Escolher',cents:p?cents(p.price):0};}),...['case','psu','cooler'].map(key=>{const p=products.find(p=>p._id===refId(config?.[key]));return {step:key,label:{case:'Gabinete',psu:'Fonte inclusa',cooler:'Cooler incluso'}[key],productId:p?._id,name:p?.name||'Aguardando configuração',cents:p?cents(p.price):0};}),...(config?.extras||[]).map((e,i)=>({step:`extra${i}`,label:'Incluso',name:e.name,cents:cents(e.price||0)}))];
  const subtotal=rows.reduce((sum,r)=>sum+r.cents,0);
  const selections=officeSteps.map(([key])=>({step:key,productId:pick[key]||''}));
  const order=useOrderQuote(mini?[]:selections,subtotal,rows,{kind:mini?'mini':'office',...(mini?{family}:{}),catalogRevision:catalog.data?.revisions?.[mini?'mini':'office']||''});
  // Revalidate against a fresh catalog before enabling an existing saved selection.
  const shown= !issue && order.quote ? order.quote : null;
  function choose(product){setPick(previous=>{const next={...previous,[step]:product._id};const b=step==='board'?product:products.find(p=>p._id===next.board);if(b){for(const key of ['cpu','ram','storage']){const p=products.find(p=>p._id===next[key]);if(p && boardIssue(b,key==='cpu'?p:null,key==='ram'?p:null,key==='storage'?p:null))delete next[key];}}return next;});}
  const options=products.filter(p=>available(p) && p.category===step && (step==='storage'||p.office) && (step!=='cpu'||p.family===cpuFamily) && (step!=='board'||refs(config?.boards).includes(p._id)));
  return <div className="office office-configurator"><div className="container office-wrap"><Breadcrumb current={mini?'Mini PC Office':'Monte seu PC Office'}/><header className="office-builder-head"><Link className="office-back" to="/pc-office"><ArrowLeft size={17}/> PC Office</Link><h1>{mini?'Pequeno no espaço.':'Monte seu PC Office.'}<br/><span>{mini?'Presente na sua rotina.':'A configuração é sua.'}</span></h1><p>{mini?'Escolha entre Intel Core i3, i5 e i7. Memória, SSD e demais itens são os mesmos nas três versões.':'Escolha as peças disponíveis para o seu trabalho. A compatibilidade é conferida a cada escolha.'}</p></header>
    {catalog.error && <div className="office-alert" role="alert"><p>{catalog.error}</p><button type="button" onClick={catalog.refresh}><ArrowClockwise size={18}/> Recarregar opções</button></div>}
    <div className="office-build-grid"><div className="office-selection">
      {mini ? <><div className="office-mini-stage"><ProductImage kind="mini" src={miniConfig?.imageUrl} name={miniConfig?.name || 'Mini PC Office, imagem de referência'} hero/><span>Imagem de referência. Confira a configuração disponível abaixo.</span></div><h2>{miniConfig?.name || 'Mini PC Office'}</h2><fieldset className="office-families"><legend>Escolha o processador</legend>{['i3','i5','i7'].map(f=><button type="button" aria-pressed={family===f} className={family===f?'is-active':''} key={f} onClick={()=>setFamily(f)}>Intel Core {f}</button>)}</fieldset>{!miniIssue(miniConfig,family) ? <div className="office-mini-specs"><h3>{variant.model}</h3><dl><div><dt>Memória</dt><dd>{miniConfig.memory}</dd></div><div><dt>Armazenamento</dt><dd>{miniConfig.storage}</dd></div></dl><p>{miniConfig.specs}</p><strong>{money(cents(variant.price))}</strong></div> : <Empty loading={catalog.loading} text="Esta versão ainda está sendo preparada. Assim que a configuração e o preço forem confirmados, você poderá selecioná-la aqui."/>}</> : <>
      <nav className="office-steps" aria-label="Componentes do PC Office">{officeSteps.map(([key,label],index)=><button key={key} type="button" aria-current={step===key?'step':undefined} className={step===key?'is-active':''} onClick={()=>setStep(key)}><span>{pick[key]?<Check size={15}/>:index+1}</span>{label}</button>)}</nav>
      <h2>{officeSteps.find(([key])=>key===step)[1]}</h2>{step==='cpu' && <fieldset className="office-families"><legend>Família Intel Core</legend>{['i3','i5','i7'].map(f=><button type="button" key={f} aria-pressed={cpuFamily===f} className={cpuFamily===f?'is-active':''} onClick={()=>setCpuFamily(f)}>Core {f}</button>)}</fieldset>}
      {!base && options.length ? <div className="office-options">{options.map(p=>{const reason=step==='board'?boardIssue(p,selected,null,null):current?boardIssue(current,step==='cpu'?p:null,step==='ram'?p:null,step==='storage'?p:null):'';return <Option key={p._id} product={p} selected={pick[step]===p._id} reason={reason} onClick={()=>choose(p)}/>;})}</div> : <Empty loading={catalog.loading} text="Estamos preparando as opções de PC Office. Os componentes aparecerão aqui quando preços, estoque e compatibilidade estiverem confirmados."/>}
      <div className="office-step-actions"><button type="button" className="office-button is-secondary" onClick={()=>{const index=officeSteps.findIndex(([key])=>key===step);setStep(officeSteps[(index+1)%4][0]);}}>Próximo componente <ArrowUpRight size={18}/></button><button type="button" className="office-link" onClick={()=>setPick({})}>Limpar escolhas</button></div>
      <div className="office-included"><DesktopTower size={30}/><div><h3>O restante também faz parte.</h3>{!base ? <p>{products.find(p=>p._id===refId(config.case))?.name}. Fonte e cooler já estão incluídos no resumo. {config.includedNotes}</p> : <p>O PC Office usa o gabinete Hayom GB1752. Fonte, refrigeração e demais itens necessários serão definidos e incluídos no preço antes de liberar as configurações.</p>}</div></div>
      </>}
    </div><aside className="office-summary" aria-label="Resumo do pedido"><h2>{mini?'Seu Mini PC':'Seu PC Office'}</h2>{rows.length>0 && <ul>{(shown?.items||rows).map(r=><li key={r.step}><span>{r.label}</span><strong>{r.name}</strong>{(r.productId || r.step.startsWith('extra')) && <span>{money(r.cents)}</span>}{!mini && officeSteps.some(([key])=>key===r.step) && pick[r.step] && <button type="button" onClick={()=>setPick(p=>{const next={...p};delete next[r.step];return next;})}>Remover</button>}</li>)}</ul>}
      {!issue && <div className="office-summary-specs">{shown?.details ? shown.details.map((line,i)=><p key={i}>{line}</p>) : mini && <p>{miniConfig.memory} · {miniConfig.storage}<br/>{miniConfig.specs}</p>}</div>}
      <CouponOffer offer={offer}/><CouponForm order={order} disabled={Boolean(issue)}/>
      <dl className="office-totals"><div><dt>Subtotal{issue?' parcial':''}</dt><dd>{rows.some(r=>r.productId)?money(shown?.subtotalCents??subtotal):'A definir'}</dd></div><div><dt>Desconto do cupom</dt><dd>{shown?.coupon?`− ${money(shown.discountCents)}`:money(0)}</dd></div><div><dt>Total estimado{shown?.coupon?' com desconto':''}</dt><dd>{!issue?money(shown?.totalCents??subtotal):'A definir'}</dd></div></dl>
      {issue && <p className="office-pending">{issue}</p>}<button className="office-button" type="button" onClick={order.checkout} disabled={Boolean(issue)||order.busy}>{order.busy?'Conferindo…':'Pedir pelo WhatsApp'}<WhatsappLogo size={22}/></button><p className="office-footnote">Preços e disponibilidade são validados antes do envio. Frete e serviços à parte não entram no desconto. O orçamento final é confirmado pela Capucho.</p>
    </aside></div><section className="office-help"><div><h2>Precisa de uma indicação?</h2><p>Conte para a Capucho o que você precisa no dia a dia.</p></div><a className="office-button is-secondary" href={wa('Olá, Capucho! Gostaria de uma indicação de PC Office para o meu trabalho.')} target="_blank" rel="noreferrer">Conversar sobre meu PC <WhatsappLogo size={21}/></a></section>
  </div></div>;
}
function Empty({loading,text}){return <div className="office-empty" role="status"><Cpu size={35} weight="light"/><h3>{loading?'Buscando opções…':'Novas opções em breve'}</h3><p>{loading?'Estamos consultando as configurações da Capucho.':text}</p></div>;}
