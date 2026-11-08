import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {reservation} from '../lib/reservation.mjs';

test('existing quantities become one and adding the same item twice never duplicates it',()=>{
  const context=vm.createContext({location:{hostname:'localhost'},localStorage:{getItem(){return null;},setItem(){}},inform(){}});
  vm.runInContext(readFileSync(new URL('../dist/data.js',import.meta.url),'utf8'),context);
  const basket=context.singleItemBasket({ring:5,earrings:2,removed:0});
  assert.equal(basket.ring,1);assert.equal(basket.earrings,1);assert(!('removed' in basket));
  const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  vm.runInContext('let basket={};'+source.slice(source.indexOf('function setCart('),source.indexOf('// Keep existing elements'))+';globalThis.readBasket=()=>basket;',context);
  context.setCart({id:'ring'},1);context.setCart({id:'ring'},2);
  assert.equal(context.readBasket().ring,1);
  assert.equal(Object.keys(context.readBasket()).length,1);
  context.setCart({id:'ring'},0);assert.equal(Object.keys(context.readBasket()).length,0);
  assert(!source.includes('data-qty='));
});

test('new reservation requests cannot order more than one of the same piece',async()=>{
  const originalFetch=globalThis.fetch;
  process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_SECRET_KEY='test';
  let calls=0;
  globalThis.fetch=async()=>{calls++;return {ok:true,text:async()=> '[]'};};
  const id='11111111-1111-1111-1111-111111111111';
  const res={code:200,status(n){this.code=n;return this;},json(body){this.body=body;return this;}};
  try {
    await reservation('chat-start',{body:{id,secret:id,contact:{firstName:'Azizbek',lastName:'Karimov',phone:'+998901234567'},items:[{id,qty:2}]}},res,false);
    assert.equal(res.code,400);assert.equal(calls,1);
  }finally{globalThis.fetch=originalFetch;}
});
