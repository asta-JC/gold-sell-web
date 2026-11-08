import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {reservation} from '../lib/reservation.mjs';
const dataContext=vm.createContext({location:{hostname:'localhost'},localStorage:{getItem(){return null;}}});
vm.runInContext(readFileSync(new URL('../dist/data.js',import.meta.url),'utf8'),dataContext);

test('Uzbek and Cyrillic names accept letters and apostrophes, rejecting digits and symbols',()=>{
  for(const name of ['Azizbek','Karimov','O‘g‘iloy','Gʻayrat','Азизбек','Анна-Мария']) assert(dataContext.contactNameValid(name),name);
  for(const name of ['Aziz123','@Karimov','123','***','',"'"]) assert(!dataContext.contactNameValid(name),name);
});
test('phone supports digit entry, pasted national/international formats, and nine digit limit',()=>{
  for(const value of ['901234567','+998 (90) 123-45-67','998901234567','90 123 45 67']) {
    assert.equal(dataContext.formatContactPhone(value),'(90) 123-45-67');
    assert.equal(dataContext.phoneNationalDigits(value),'901234567');
  }
  assert.equal(dataContext.formatContactPhone('9'),'(9');
  assert.equal(dataContext.formatContactPhone('90123'),'(90) 123');
  assert.equal(dataContext.formatContactPhone('abcdef'),'');
  assert.equal(dataContext.phoneNationalDigits('90123456789'),'901234567');
});
test('recommendations only include other published products from the same category, newest first',()=>{
  const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  const products=[{id:'old',category:'rings'},{id:'self',category:'rings'},{id:'earrings',category:'earrings'},{id:'new',category:'rings'},{id:'newest',category:'rings'}];
  const context=vm.createContext({published:()=>products});
  vm.runInContext(source.slice(source.indexOf('function relatedProducts('),source.indexOf('function detail(')),context);
  assert.deepEqual(Array.from(context.relatedProducts(products[1]),p=>p.id),['newest','new','old']);
  assert.equal(context.relatedProducts({id:'none',category:'sets'}).length,0);
});
test('reservation API rejects digits in names and incomplete phone numbers',async()=>{
  const originalFetch=globalThis.fetch;
  process.env.SUPABASE_URL='https://example.supabase.co';
  process.env.SUPABASE_SECRET_KEY='test';
  globalThis.fetch=async()=>({ok:true,text:async()=> '[]'});
  const id='11111111-1111-1111-1111-111111111111';
  try {
    for(const contact of [{firstName:'Aziz123',lastName:'Karimov',phone:'+998901234567'},{firstName:'Azizbek',lastName:'Karimov',phone:'+99890123'}]) {
      const res={code:200,status(n){this.code=n;return this;},json(body){this.body=body;return this;}};
      await reservation('chat-start',{body:{id,secret:id,contact}},res,false);
      assert.equal(res.code,400);
      assert.equal(res.body.error,'invalidContact');
    }
  }finally {globalThis.fetch=originalFetch;}
});
