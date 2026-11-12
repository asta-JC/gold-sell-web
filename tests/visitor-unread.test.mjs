import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {reservation} from '../lib/reservation.mjs';

test('visitor sees unread replies on home, reading clears only that chat, and later replies return', async () => {
  const storage = new Map([['mg-visitor-threads',JSON.stringify([{id:'one',secret:'s1'},{id:'two',secret:'s2'}])]]);
  const badge = {};
  const latest = {one:'2026-11-08T10:00:00Z',two:'2026-11-08T11:00:00Z'};
  const calls=[];
  const context = vm.createContext({
    readLocal:(key,fallback)=>storage.has(key)?JSON.parse(storage.get(key)):fallback,
    localStorage:{setItem:(key,value)=>storage.set(key,value)},
    document:{hidden:false,addEventListener(){}}, addEventListener(){},
    localMode:false,catalogState:'ready',isAdmin:false,lang:0,
    inform:key=>{throw new Error(key);},
    $:selector=>selector==='#visitor-chat-badge'?badge:null,
    t:key=>key,escapeHtml:value=>value,icon:()=>'',
    catalogRequest:async(action,access)=>{calls.push(action);assert.equal(action,'chat-unread');return {latest:latest[access.id]};}
  });
  vm.runInContext(readFileSync(new URL('../dist/chat.js',import.meta.url),'utf8'),context);
  await context.refreshChat();
  assert.equal(badge.textContent,2);
  assert.equal(badge.hidden,false);
  assert.deepEqual(calls,['chat-unread','chat-unread']); // No full thread fetch or read marking on home.
  context.markVisitorChatRead({id:'one'},[{sender:'staff',created_at:latest.one},{sender:'visitor',created_at:'2026-11-08T12:00:00Z'}]);
  assert.equal(badge.textContent,1);
  context.markVisitorChatRead({id:'two'},[{sender:'staff',created_at:latest.two}]);
  assert.equal(badge.hidden,true);
  await context.refreshChat();
  assert.equal(badge.hidden,true);
  latest.one='2026-11-08T13:00:00Z';
  await context.refreshChat();
  assert.equal(badge.textContent,1);
  assert.equal(badge.hidden,false);
  assert.equal(JSON.parse(storage.get('mg-visitor-read-chat')).one,Date.parse('2026-11-08T10:00:00Z'));
});

test('unread endpoint authenticates thread secret before returning only the latest staff reply', async () => {
  const oldFetch=globalThis.fetch;
  process.env.SUPABASE_URL='https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY='test-key';
  const calls=[];
  const id='11111111-1111-1111-1111-111111111111';
  let authorized=false;
  globalThis.fetch=async url=>{
    calls.push(url);
    const data=url.includes('reservation_messages?') ? [{created_at:'2026-11-08T10:00:00Z'}] : authorized?[{
      id,created_at:'2026-11-07T10:00:00Z',contact:{firstName:'Private'},items:[
        {uz:'Uzuk',ru:'Кольцо',photo:'ring photo.webp',price:1000000}
      ]
    }]:[];
    return {ok:true,text:async()=>JSON.stringify(data)};
  };
  const run=async(summary=false)=>{
    const res={code:200,status(n){this.code=n;return this;},json(body){this.body=body;return this;}};
    await reservation('chat-unread',{body:{id,secret:'22222222-2222-2222-2222-222222222222',summary}},res,false);
    return res;
  };
  try {
    assert.equal((await run(true)).code,404);
    assert.equal(calls.length,1);
    assert.match(calls[0],/visitor_hash=eq\.[0-9a-f]{64}/);
    authorized=true;
    const result=await run();
    assert.deepEqual(result.body,{latest:'2026-11-08T10:00:00Z'});
    assert.match(calls.at(-1),/sender=eq.staff/);
    assert.match(calls.at(-1),/limit=1/);
    assert.deepEqual((await run(true)).body,{
      latest:'2026-11-08T10:00:00Z',
      summary:{
        created_at:'2026-11-07T10:00:00Z',
        items:[{uz:'Uzuk',ru:'Кольцо',photo:'https://example.supabase.co/storage/v1/object/public/product-photos/ring%20photo.webp'}]
      }
    });
  } finally {globalThis.fetch=oldFetch;}
});
