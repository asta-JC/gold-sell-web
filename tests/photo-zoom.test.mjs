import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../dist/zoom.js',import.meta.url),'utf8');

test('photo zoom clamps scale and panning to visible image boundaries',()=>{
  const c=vm.createContext({});vm.runInContext(script,c);
  const clamp=(view,w=800,h=600,iw=600,ih=600)=>JSON.parse(JSON.stringify(c.clampPhotoView(view,w,h,iw,ih)));
  assert.deepEqual(clamp({scale:0,x:100,y:-100}),{scale:1,x:0,y:0});
  assert.deepEqual(clamp({scale:2,x:500,y:-500}),{scale:2,x:200,y:-300});
  assert.equal(clamp({scale:100,x:0,y:0}).scale,5);
});

test('viewer supports desktop zoom, two-pointer pinch, panning and cleanup on Escape/native close',()=>{
  const elements=[];
  function element(){const e={style:{},handlers:{},classList:{toggle(){}},clientWidth:800,clientHeight:600,addEventListener(type,fn){this.handlers[type]=fn;},setAttribute(){},append(){},setPointerCapture(){},getBoundingClientRect(){return {left:0,top:0,width:800,height:600};}};elements.push(e);return e;}
  const stage=element(),level=element(),out=element(),zin=element();
  let dialog,image;
  const listeners=new Map();
  const body={style:{overflow:'auto'},append(){}};
  const doc={documentElement:{lang:'uz'},body,querySelector(){return null;},createElement(tag){
    const e=element();
    if(tag==='dialog') {dialog=e;e.querySelector=selector=>({'[data-zoom="in"]':zin,'[data-zoom="out"]':out,'.photo-zoom-level':level,'.photo-viewer-stage':stage}[selector]);e.showModal=()=>{};e.close=()=>e.handlers.close();e.remove=()=>{e.removed=true;};}
    else {image=e;e.naturalWidth=1200;e.naturalHeight=1200;e.complete=true;}
    return e;
  }};
  const c=vm.createContext({document:doc,window:{addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:type=>listeners.delete(type)}});
  vm.runInContext(script,c);
  let focusRestored=false;
  c.openProductZoom({querySelector:()=>({alt:'Ring',src:'https://example.test/ring.jpg'}),isConnected:true,focus(){focusRestored=true;}});
  assert.equal(body.style.overflow,'hidden');assert.equal(level.textContent,'100%');
  const click=action=>dialog.handlers.click({target:{closest:()=>({dataset:{zoom:action}})}});
  click('in');assert.equal(level.textContent,'140%');
  click('reset');assert.equal(level.textContent,'100%');
  const pointer=(id,x,y)=>({pointerId:id,pointerType:'touch',clientX:x,clientY:y});
  stage.handlers.pointerdown(pointer(1,300,300));stage.handlers.pointerdown(pointer(2,500,300));
  stage.handlers.pointermove(pointer(2,700,300));assert.equal(level.textContent,'200%');
  stage.handlers.pointerup(pointer(2,700,300));
  stage.handlers.pointermove(pointer(1,350,300));assert.match(image.style.transform,/scale\(2\)/);
  stage.handlers.pointercancel(pointer(1,350,300));
  let prevented=false;stage.handlers.wheel({deltaY:-100,clientX:400,clientY:300,preventDefault(){prevented=true;}});
  assert(prevented);assert(Number(level.textContent.replace('%',''))>200);
  dialog.close();assert(dialog.removed);assert(focusRestored);assert.equal(body.style.overflow,'auto');assert.equal(listeners.size,0);
});
