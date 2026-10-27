import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import handler from '../api/catalog.js';
import {gamerCatalogQuery} from '../shared/gamer-catalog.js';

test('catálogo gamer usa mesma origem, recupera falha temporária e mantém cache em falha total',async()=>{
  const source=(await readFile(new URL('../src/catalog.js',import.meta.url),'utf8')).replace('import { parts } from "./gamer";','export const parts = {cpu:[],board:[],ram:[],gpu:[],storage:[],cooler:[],psu:[],case:[]};');
  const originalFetch=globalThis.fetch,originalWindow=globalThis.window,originalStorage=globalThis.localStorage;
  const cache=new Map();globalThis.window={};globalThis.localStorage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
  const {loadCatalog,parts}=await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const doc={_id:'peca-cpu-example',name:'Processador publicado',category:'cpu',price:750};
  let calls=0;
  try{
    globalThis.fetch=async(url,options)=>{assert.equal(url,'/api/catalog');assert.equal(options.cache,'no-store');calls++;return calls===1?new Response('',{status:503}):Response.json({result:[doc]});};
    assert.equal(await loadCatalog(),'live');assert.equal(calls,2);assert.equal(parts.cpu[0].documentId,doc._id);
    globalThis.fetch=async()=>{throw new Error('Offline');};assert.equal(await loadCatalog(),'cached');assert.equal(parts.cpu.length,1);
    cache.clear();assert.equal(await loadCatalog(),'unavailable');assert.equal(parts.cpu.length,0);
    globalThis.fetch=async()=>Response.json({result:[]});assert.equal(await loadCatalog(),'live');assert.equal(parts.cpu.length,0);
  }finally{globalThis.fetch=originalFetch;globalThis.window=originalWindow;if(originalStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=originalStorage;}
});
test('API entrega somente catálogo publicado, preserva filtro Office, falha com 503 e não permite escrita',async()=>{
 const original=globalThis.fetch;
 const call=async method=>{const headers={};const res={setHeader:(k,v)=>headers[k]=v,status(code){this.statusCode=code;return this;},end(body){this.body=JSON.parse(body);}};await handler({method},res);return {...res,headers};};
 try{
  globalThis.fetch=async url=>{assert.equal(url.searchParams.get('perspective'),'published');assert.equal(url.searchParams.get('query'),gamerCatalogQuery);assert.match(gamerCatalogQuery,/officeOnly != true/);return Response.json({result:[{_id:'peca-cpu-example'}]});};
  const success=await call('GET');assert.equal(success.statusCode,200);assert.equal(success.body.result.length,1);assert.match(success.headers['Cache-Control'],/no-store/);
  globalThis.fetch=async()=>{throw new Error('upstream');};const fail=await call('GET');assert.equal(fail.statusCode,503);assert.equal(fail.body.result,undefined);
  assert.equal((await call('POST')).statusCode,405);
 }finally{globalThis.fetch=original;}
});
