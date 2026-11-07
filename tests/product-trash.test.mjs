import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import handler from '../api/catalog.mjs';

test('local trash hides products, preserves deadline, restores drafts, and purges after 72 hours', async () => {
  const storage = new Map();
  let now = Date.now();
  const context = vm.createContext({location:{hostname:'localhost'}, Date:class extends Date {constructor(...args){super(...(args.length ? args : [now]));} static now(){return now;}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
  vm.runInContext(readFileSync(new URL('../dist/data.js',import.meta.url),'utf8')+';globalThis.catalogTest=localCatalog;',context);
  const c = context.catalogTest;
  c.save({id:'test-product',sku:'TRASH-TEST',status:'published'});
  assert.equal(await c.trash('test-product'),null);
  const deletedAt=c.all()[0].deleted_at;
  assert.equal(c.all()[0].status,'archived');
  now += 1000;
  await c.trash('test-product');
  assert.equal(c.all()[0].deleted_at,deletedAt);
  assert.equal(await c.trash('test-product',true),null);
  assert.equal(c.all()[0].status,'draft');
  await c.trash('test-product');
  now += 72*60*60*1000-1;
  assert.equal(c.all().length,1);
  now += 1;
  assert.equal(c.all().length,0);
  assert.equal(await c.trash('test-product',true),'gone');
  assert.equal(JSON.parse(storage.get('zarrin-catalog-v1')).length,0);
});

test('API checks origin, staff membership and UUID before deletion; handles expired restore', async () => {
  process.env.SUPABASE_URL='https://example.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_KEY='test';
  const originalFetch=globalThis.fetch;
  const id='11111111-1111-1111-1111-111111111111';
  let member=true, rpcResult=id, calls=[];
  globalThis.fetch=async (url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.includes('/staff?') ? (member?[{user_id:id}]:[]) : rpcResult};};
  const run=async (action,body,extra={})=>{
    const res={code:200,setHeader(){},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
    await handler({method:'POST',query:{action},body,cookies:{mg_staff:'test'},headers:{origin:'https://shop.test',host:'shop.test'},...extra},res);
    return res;
  };
  try {
    assert.equal((await run('trash',{id},{cookies:{}})).code,401);
    member=false;
    assert.equal((await run('trash',{id})).code,401);
    member=true;
    assert.equal((await run('trash',{id:'invalid'})).code,400);
    assert.equal((await run('trash',{id},{headers:{origin:'https://evil.test',host:'shop.test'}})).code,403);
    assert.equal((await run('trash',{id})).code,200);
    assert.deepEqual(JSON.parse(calls.at(-1).options.body),{product_id:id,restore:false});
    assert.equal((await run('restore',{id})).code,200);
    assert.equal(JSON.parse(calls.at(-1).options.body).restore,true);
    rpcResult=null;
    assert.equal((await run('restore',{id})).code,409);
  } finally {globalThis.fetch=originalFetch;}
});
